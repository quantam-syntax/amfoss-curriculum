#include <limits.h>
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <signal.h>
#include <errno.h>

#define MAX_LINE 1024
#define MAX_ARGS 128
#define MAX_BG   128

/* Background process tracking */
pid_t bg_pids[MAX_BG];
int bg_count = 0;

/* Foreground process PID */
pid_t fg_pid = -1;

/* ================= SIGNAL HANDLERS ================= */

void sigint_handler(int sig) {
    (void)sig;
    write(STDOUT_FILENO, "\nBackground processes:\n", 24);
    for (int i = 0; i < bg_count; i++) {
        char buf[64];
        int len = snprintf(buf, sizeof(buf), "PID: %d\n", bg_pids[i]);
        write(STDOUT_FILENO, buf, len);
    }
    write(STDOUT_FILENO, "myshell> ", 9);
}

void sigtstp_handler(int sig) {
    (void)sig;
    if (fg_pid > 0) {
        kill(fg_pid, SIGTSTP);
    }
}

/* ================= UTILITIES ================= */

void add_bg_process(pid_t pid) {
    if (bg_count < MAX_BG) {
        bg_pids[bg_count++] = pid;
    }
}

void reap_bg_processes(void) {
    int status;
    pid_t pid;

    while ((pid = waitpid(-1, &status, WNOHANG)) > 0) {
        for (int i = 0; i < bg_count; i++) {
            if (bg_pids[i] == pid) {
                bg_pids[i] = bg_pids[--bg_count];
                break;
            }
        }
    }
}

/* ================= PARSING ================= */

int parse_input(char *line, char **args, int *background) {
    int argc = 0;
    *background = 0;

    char *token = strtok(line, " \t\n");
    while (token && argc < MAX_ARGS - 1) {
        if (strcmp(token, "&") == 0) {
            *background = 1;
        } else {
            args[argc++] = token;
        }
        token = strtok(NULL, " \t\n");
    }
    args[argc] = NULL;
    return argc;
}

/* ================= BUILT-INS ================= */

int handle_builtin(char **args) {
    if (strcmp(args[0], "exit") == 0) {
        exit(0);
    }

    if (strcmp(args[0], "cd") == 0) {
        if (!args[1]) {
            fprintf(stderr, "cd: missing argument\n");
        } else if (chdir(args[1]) != 0) {
            perror("cd");
        }
        return 1;
    }

    if (strcmp(args[0], "pwd") == 0) {
        char cwd[PATH_MAX];
        if (getcwd(cwd, sizeof(cwd))) {
            puts(cwd);
        } else {
            perror("pwd");
        }
        return 1;
    }

    return 0;
}

/* ================= MAIN LOOP ================= */

int main(void) {
    char line[MAX_LINE];
    char *args[MAX_ARGS];

    struct sigaction sa_int = {0}, sa_tstp = {0};
    sa_int.sa_handler = sigint_handler;
    sa_tstp.sa_handler = sigtstp_handler;
    sigaction(SIGINT, &sa_int, NULL);
    sigaction(SIGTSTP, &sa_tstp, NULL);

    while (1) {
        reap_bg_processes();

        printf("myshell> ");
        fflush(stdout);

        if (!fgets(line, sizeof(line), stdin)) {
            putchar('\n');
            break;
        }

        int background = 0;
        int argc = parse_input(line, args, &background);
        if (argc == 0) continue;

        if (handle_builtin(args)) continue;

        pid_t pid = fork();
        if (pid < 0) {
            perror("fork");
            continue;
        }

        if (pid == 0) {
            signal(SIGINT, SIG_DFL);
            signal(SIGTSTP, SIG_DFL);

            execvp(args[0], args);
            perror("execvp");
            exit(EXIT_FAILURE);
        }

        if (background) {
            add_bg_process(pid);
            printf("[bg] PID %d\n", pid);
        } else {
            fg_pid = pid;
            waitpid(pid, NULL, WUNTRACED);
            fg_pid = -1;
        }
    }

    return 0;
}
