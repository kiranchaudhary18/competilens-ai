#!/usr/bin/env python3
import json
import os
import sys
import threading
import urllib.request
import urllib.error
from tkinter import Tk, ttk, StringVar, Text, END
from tkinter import messagebox


class CompetiLensDesktopApp:
    def __init__(self, root):
        self.root = root
        self.root.title("CompetiLens AI Desktop")
        self.root.geometry("900x680")
        self.root.minsize(820, 620)

        self.backend_url = os.getenv("COMPETILENS_BACKEND_URL", "http://127.0.0.1:5000")
        self.ai_engine_url = os.getenv("COMPETILENS_AI_URL", "http://127.0.0.1:8000")
        self.access_token = None
        self.workspace_id = None

        self.build_ui()
        self.check_services_async()

    def build_ui(self):
        self.root.columnconfigure(0, weight=1)
        self.root.rowconfigure(1, weight=1)

        header = ttk.Frame(self.root, padding=(20, 20, 20, 10))
        header.grid(row=0, column=0, sticky="ew")
        header.columnconfigure(1, weight=1)

        ttk.Label(header, text="CompetiLens AI Desktop", font=("Segoe UI", 18, "bold")).grid(row=0, column=0, sticky="w")
        ttk.Label(header, text="Secure desktop access for company data and AI workflows", font=("Segoe UI", 10)).grid(row=1, column=0, sticky="w", pady=(4, 0))

        self.status_var = StringVar(value="Checking backend and AI engine connections...")
        ttk.Label(header, textvariable=self.status_var, foreground="#2563eb", font=("Segoe UI", 10, "bold")).grid(row=0, column=1, sticky="e")

        main = ttk.Frame(self.root, padding=(20, 0, 20, 20))
        main.grid(row=1, column=0, sticky="nsew")
        main.columnconfigure(0, weight=1)
        main.columnconfigure(1, weight=1)
        main.rowconfigure(0, weight=1)

        left = ttk.LabelFrame(main, text="Authentication", padding=(14, 12))
        left.grid(row=0, column=0, sticky="nsew", padx=(0, 10))
        left.columnconfigure(0, weight=1)

        ttk.Label(left, text="Email").grid(row=0, column=0, sticky="w", pady=(0, 4))
        self.email_var = StringVar(value="")
        ttk.Entry(left, textvariable=self.email_var).grid(row=1, column=0, sticky="ew")

        ttk.Label(left, text="Password").grid(row=2, column=0, sticky="w", pady=(10, 4))
        self.password_var = StringVar(value="")
        ttk.Entry(left, textvariable=self.password_var, show="•").grid(row=3, column=0, sticky="ew")

        ttk.Label(left, text="Workspace / Company ID (optional)").grid(row=4, column=0, sticky="w", pady=(10, 4))
        self.workspace_var = StringVar(value="")
        ttk.Entry(left, textvariable=self.workspace_var).grid(row=5, column=0, sticky="ew")

        self.login_button = ttk.Button(left, text="Login", command=self.login)
        self.login_button.grid(row=6, column=0, sticky="ew", pady=(14, 8))

        self.auth_log = Text(left, height=8, wrap="word")
        self.auth_log.grid(row=7, column=0, sticky="nsew")
        left.rowconfigure(7, weight=1)

        right = ttk.LabelFrame(main, text="Workspace & AI Access", padding=(14, 12))
        right.grid(row=0, column=1, sticky="nsew", padx=(10, 0))
        right.columnconfigure(0, weight=1)
        right.rowconfigure(1, weight=1)

        ttk.Label(right, text="Backend URL").grid(row=0, column=0, sticky="w")
        self.backend_label = ttk.Label(right, text=self.backend_url)
        self.backend_label.grid(row=1, column=0, sticky="w", pady=(0, 10))

        ttk.Label(right, text="AI Engine URL").grid(row=2, column=0, sticky="w")
        self.ai_label = ttk.Label(right, text=self.ai_engine_url)
        self.ai_label.grid(row=3, column=0, sticky="w", pady=(0, 10))

        ttk.Label(right, text="Company Access State").grid(row=4, column=0, sticky="w")
        self.access_state = StringVar(value="Not authenticated")
        ttk.Label(right, textvariable=self.access_state, foreground="#0f766e", font=("Segoe UI", 10, "bold")).grid(row=5, column=0, sticky="w", pady=(0, 8))

        self.workspace_details = Text(right, height=14, wrap="word")
        self.workspace_details.grid(row=6, column=0, sticky="nsew")

        self.log("CompetiLens desktop app ready.")
        self.log(f"Backend target: {self.backend_url}")
        self.log(f"AI engine target: {self.ai_engine_url}")

    def log(self, message):
        self.auth_log.insert(END, f"{message}\n")
        self.auth_log.see(END)

    def workspace_log(self, message):
        self.workspace_details.insert(END, f"{message}\n")
        self.workspace_details.see(END)

    def clear_logs(self):
        self.auth_log.delete("1.0", END)
        self.workspace_details.delete("1.0", END)

    def check_services_async(self):
        threading.Thread(target=self.check_services, daemon=True).start()

    def check_services(self):
        backend_ok = self.ping(self.backend_url + "/")
        ai_ok = self.ping(self.ai_engine_url + "/health")
        status = "Connected" if backend_ok and ai_ok else "Connection issue"
        self.root.after(0, lambda: self.update_status(status, backend_ok, ai_ok))

    def update_status(self, status, backend_ok, ai_ok):
        self.status_var.set(f"Backend: {'OK' if backend_ok else 'DOWN'} | AI: {'OK' if ai_ok else 'DOWN'}")
        if backend_ok and ai_ok:
            self.access_state.set("Ready for authentication and company workspace access")
        else:
            self.access_state.set("Service connection issue: start backend and AI engine first")

    def ping(self, url):
        try:
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=4) as resp:
                return resp.status < 500
        except Exception:
            return False

    def request_json(self, path, method="GET", payload=None, token=None, workspace_id=None):
        url = self.backend_url.rstrip("/") + path
        data = None
        headers = {}
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"
        if token:
            headers["Authorization"] = f"Bearer {token}"
        if workspace_id:
            headers["x-workspace-id"] = workspace_id
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                body = response.read().decode("utf-8")
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", "ignore")
            raise RuntimeError(f"HTTP {exc.code}: {body}") from exc
        except Exception as exc:
            raise RuntimeError(str(exc)) from exc

    def login(self):
        email = self.email_var.get().strip()
        password = self.password_var.get().strip()
        workspace_id = self.workspace_var.get().strip()

        if not email or not password:
            messagebox.showerror("Missing fields", "Please enter an email and password.")
            return

        self.login_button.config(state="disabled")
        self.clear_logs()
        self.log("Authenticating with backend...")

        def worker():
            try:
                result = self.request_json(
                    "/auth/login",
                    method="POST",
                    payload={"email": email, "password": password},
                )
                self.access_token = result.get("data", {}).get("accessToken")
                user = result.get("data", {}).get("user", {})
                self.workspace_id = workspace_id or user.get("workspaceId")
                self.root.after(0, lambda: self.on_login_success(user, result))
            except Exception as exc:
                error_message = str(exc)
                self.root.after(0, lambda: self.on_login_error(error_message))

        threading.Thread(target=worker, daemon=True).start()

    def on_login_success(self, user, result):
        self.login_button.config(state="normal")
        self.log("Login successful.")
        self.log(f"User: {user.get('email', 'unknown')}")
        self.access_state.set("Authenticated")

        if self.access_token:
            self.log("Access token received. Checking workspace access...")
            self.check_workspace_access()
        else:
            self.log("No access token returned by backend.")

    def on_login_error(self, message):
        self.login_button.config(state="normal")
        self.log(f"Login failed: {message}")
        self.access_state.set("Authentication failed")
        messagebox.showerror("Login failed", message)

    def check_workspace_access(self):
        def worker():
            try:
                if not self.access_token:
                    raise RuntimeError("No access token available")
                result = self.request_json(
                    "/workspace/me",
                    method="GET",
                    token=self.access_token,
                    workspace_id=self.workspace_id,
                )
                self.root.after(0, lambda: self.on_workspace_success(result))
            except Exception as exc:
                self.root.after(0, lambda: self.on_workspace_error(str(exc)))

        threading.Thread(target=worker, daemon=True).start()

    def on_workspace_success(self, result):
        self.log("Workspace access confirmed.")
        self.workspace_log(json.dumps(result, indent=2))
        self.access_state.set("Company workspace access granted")

    def on_workspace_error(self, message):
        self.log(f"Workspace access failed: {message}")
        self.workspace_log(f"Workspace access failed: {message}")
        self.access_state.set("Workspace access denied")


def main():
    root = Tk()
    app = CompetiLensDesktopApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
