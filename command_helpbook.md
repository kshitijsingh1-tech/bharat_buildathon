# Git & GitHub Command Helpbook

This guide covers all the Git and GitHub workflow commands we used and discussed in this session.

---

## 1. Initializing and Setup

### Initialize Git Repository
If you start a project from scratch and it isn't tracked by Git yet:
```bash
git init
```

### Link Local Repository to GitHub
Add a remote repository pointing to your GitHub URL (named `origin` by default):
```bash
git remote add origin https://github.com/manthan-hex/uniflow
```

### Update or Set Remote URL
If you need to change the repository URL or embed authentication credentials:
```bash
git remote set-url origin https://github.com/manthan-hex/uniflow
```

---

## 2. Basic Workflow (Add, Commit, Push)

### Stage Changes
Prepare files to be committed:
```bash
# Stage all files in the current folder (including untracked ones)
git add .

# Stage a specific file
git add filename.md
```

### Commit Changes
Save staged changes to history:
```bash
git commit -m "Your commit message"
```

### Amend Last Commit
If you want to edit the message or add more files to the very last commit:
```bash
git commit --amend -m "New updated commit message"
```

### Push Changes to GitHub
Upload your local commits to GitHub:
```bash
# Push for the first time and set tracking branch
git push -u origin master

# Push with force (safe check) when you amended or rewrote commits
git push --force-with-lease
```

---

## 3. Branching

### View Current Branch
```bash
git branch
```

### Create and Switch to a New Branch
```bash
# Create and switch using checkout
git checkout -b <branch_name>

# Create and switch using switch (newer syntax)
git switch -c <branch_name>
```
*Note: Do not use angle brackets `< >` around your branch name in the terminal.*

### Switch to an Existing Branch
```bash
git checkout <branch_name>
# Or: git switch <branch_name>
```

### Pull Changes
Fetch and merge changes from GitHub to local:
```bash
git pull origin <branch_name>
```

### Merge a Branch
Merge changes from a feature branch into your active branch (e.g., master):
```bash
git merge <branch_name>
```

---

## 4. Troubleshooting & Common Terminal Errors

### 1. HTTP 403: Permission Denied (`Permission denied to <username>`)
**Error:** `remote: Permission to owner/repo.git denied to username` / `fatal: unable to access ... 403`
**Causes & Solutions:**
* **Missing Collaborator Access:** The repository owner (e.g. `kshitijsingh1-tech`) has not added your account (`manthan-h`) as a collaborator with write access.
  * **Solution:** The repo owner must go to **GitHub Repo -> Settings -> Collaborators -> Add people** and add `manthan-h`. You must then **accept the repository invitation** sent to your email or GitHub notifications.
* **Cached Windows Credentials Mismatch:** Windows Credential Manager is sending saved credentials for a different GitHub account or an expired Personal Access Token.
  * **Solution:** Delete the cached GitHub credentials from Windows terminal:
    ```cmd
    cmdkey /delete:git:https://github.com
    ```
    Or open **Control Panel -> Credential Manager -> Windows Credentials**, look for `git:https://github.com` and click **Remove**.
  * On your next `git push`, GitHub will prompt you to authenticate again via browser or Personal Access Token (PAT).

### 2. `nothing to commit, working tree clean`
**Error:** Running `git commit -m "..."` produces no commit because no modified/new files were staged.
**Solution:** You must stage files first before committing:
```bash
git add .
git commit -m "Your commit message"
```

### 3. Command Not Found / Typo (`gti : The term 'gti' is not recognized`)
**Error:** Misspelled command in terminal (e.g. typing `gti push` instead of `git push`).
**Solution:** Check spelling and re-run:
```bash
git push -u origin main
```

### 4. Renaming Local Branch from `master` to `main`
**Command:** Rename local branch to `main` and set up remote tracking:
```bash
git branch -M main
git push -u origin main
```

### 5. Changing Git & GitHub User from Terminal

#### A. Change GitHub Authentication Account (Fix 403 Permission Denied)
To switch which GitHub account pushes to remote repositories:

1. **Delete saved Windows credentials:**
   ```cmd
   cmdkey /delete:git:https://github.com
   ```
2. **Force Git to prompt for the desired GitHub username:**
   ```bash
   git remote set-url origin https://YOUR_GITHUB_USERNAME@github.com/kshitijsingh1-tech/bharat_buildathon.git
   ```
3. **Push to trigger re-authentication:**
   ```bash
   git push -u origin main
   ```
   *(A browser sign-in window or Personal Access Token (PAT) prompt will pop up allowing you to log in as `YOUR_GITHUB_USERNAME`.)*

#### B. Change Commit Author Info (Name & Email)
To change the name and email attached to your local commits:
```bash
# Change for current repository only:
git config user.name "Your New Name"
git config user.email "your_email@example.com"

# Change globally for all repositories:
git config --global user.name "Your New Name"
git config --global user.email "your_email@example.com"

# Check current configured user:
git config user.name
git config user.email
```

### 6. Managing Stored Windows Credentials
**List Stored Credentials:**
```cmd
cmdkey /list
```
**Delete Stored GitHub Credentials:**
```cmd
cmdkey /delete:git:https://github.com
```

---

## 5. Collaborative Workflow & Branch Permissions (For `uniflow`)

In a team project like `uniflow` where multiple developers (e.g., Aayush, Kshitij, Laxya, Richa, Hiteshi, Saanvi) are collaborating, you want to ensure code quality by restricting who can commit directly to the `master`/`main` branch, while allowing team members to push only to their assigned branches.

Here is how you set this up on GitHub:

### Phase A: Add Team Members as Collaborators
Before anyone can push, they need write access to the repository:
1. Go to your repository on GitHub (`https://github.com/manthan-hex/uniflow`).
2. Click on **Settings** (gear icon) -> **Collaborators**.
3. Click **Add people** and invite your friends by their GitHub usernames or emails.

---

### Phase B: Protect the `master` Branch (Only Owner Can Push)
To prevent your friends from accidentally committing directly to the `master`/`main` branch:
1. Go to **Settings** -> **Branches**.
2. Under **Branch protection rules**, click **Add branch ruleset** (or **Add rule**).
3. Set the rule target:
   - Target branch: Select **Include default branch** (or specify `master`).
4. Enable **Restrict who can push** (if you have GitHub Pro, Team, or Enterprise, or if the repo is public).
5. Alternatively, check **Require a pull request before merging**:
   - This prevents direct pushes to `master` for everyone.
   - Developers must submit a Pull Request (PR) to merge their branch.
   - You, as the owner, are the only one who can approve and merge those PRs.

---

### Phase C: Branch Isolation Workflow (Free GitHub Tier)
On free private GitHub repositories, you cannot easily set per-branch write permissions (e.g., "only Laxya can push to LaxyaRicha"). Instead, teams use a **Social/Workflow Contract** or **Forks**:

#### Option 1: The Pull Request Workflow (Recommended)
1. **Assign Branches:**
   - **Branch `AayushKshitij`** is assigned to Aayush & Kshitij.
   - **Branch `LaxyaRicha`** is assigned to Laxya & Richa.
   - **Branch `HiteshiSaanvi`** is assigned to Hiteshi & Saanvi.
2. **Pushing to Assigned Branches:**
   - Aayush and Kshitij will work locally and push only to their branch:
     ```bash
     git push origin AayushKshitij
     ```
   - Hiteshi and Saanvi will work locally and push only to their branch:
     ```bash
     git push origin HiteshiSaanvi
     ```
3. **Merging to master:**
   - When a team is ready to merge their work into `master`, they go to GitHub and open a **Pull Request (PR)** from their branch to `master`.
   - You (the repository owner) review their code on GitHub, and if everything looks good, you click **Merge**. 

#### Option 2: The Forking Workflow (Strict Permissions)
If you want absolute technical restrictions where nobody can touch other branches:
1. Do not add your friends as collaborators to `manthan-hex/uniflow`.
2. Ask your friends to click **Fork** on your repository to create their own copies.
3. They will push changes to their own forks.
4. When they want to submit code, they will submit a Pull Request from their fork back to your main repository, which only you can merge.

---

## 6. Step-by-Step Guide for Team Members

Give these steps to your friends (Aayush, Laxya, Richa, Hiteshi, Saanvi) to get them set up and working on their branches:

### Step 1: Connect and Clone the Repo
Your friend needs to open their terminal/PowerShell, navigate to their working folder, and run:
```bash
# Clone the repository to their local machine
git clone https://github.com/manthan-hex/uniflow.git

# Navigate into the cloned folder
cd uniflow
```

---

### Step 2: Fetch and Switch to Their Assigned Branch
Before editing any code, they must switch to their specific branch (do not edit on `master`!):
```bash
# Fetch all remote branches from GitHub
git fetch origin

# See ALL branches (both local and remote from GitHub)
git branch -a

# Switch to their assigned branch that already exists on GitHub (e.g., LaxyaRicha)
git checkout LaxyaRicha
```
*(They should replace `LaxyaRicha` with their specific branch name like `AayushKshitij` or `HiteshiSaanvi`).*

> [!NOTE]
> - `git checkout <branch>` (without `-b`) is used to switch to a branch that **already exists** (either locally or on GitHub).
> - `git checkout -b <branch>` (with `-b`) is used to **create and switch** to a brand new branch that does not exist yet.
> - The command is singular: **`git branch`**, not `git branches`.


---

### Step 3: Pull Latest Updates (Keep Code Fresh & Maintain Master Context)
To keep their branch from drifting too far away from the main repository (which causes huge merge conflicts later), team members must regularly sync with the main branch (`master`):

* **How to pull & merge updates from `master` into their active branch:**
  ```bash
  # Step A: Make sure they are on their active branch (e.g. LaxyaRicha)
  git checkout LaxyaRicha

  # Step B: Pull latest updates from the master branch on GitHub
  git pull origin master
  ```
  *Doing this daily brings all of the owner's and other team's merged changes into their workspace so they are always developing on top of the latest version.*

* **How to pull updates from their own branch on GitHub (if working on multiple machines or with a partner):**
  ```bash
  git pull origin LaxyaRicha
  ```

* **How to pull updates from another teammate's branch (e.g., to test Aayush's changes):**
  ```bash
  git pull origin AayushKshitij
  ```

> [!TIP]
> **What to do if there is a Merge Conflict?**
> If a team member pulls from `master` and gets a conflict:
> 1. Open the conflicted files in their editor.
> 2. Look for the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
> 3. Decide which code to keep (their changes, master's changes, or a mix of both).
> 4. Delete the conflict markers, save the files, and run:
>    ```bash
>    git add .
>    git commit -m "Resolve merge conflicts with master"
>    ```

---

### Step 4: Make Changes & Commit Locally
Now they can edit their code in their editor. Once ready, they stage their files and commit them:
```bash
# Check which files have been modified or created
git status

# OPTION A: Stage ALL changed files at once
git add .

# OPTION B: Stage only specific files (e.g. only file1.txt and file2.py)
git add path/to/file1.txt path/to/file2.py

# Create a commit with a clear message
git commit -m "Added my component / fixed the issue"
```

---

### Step 5: Push the Changes to GitHub
They upload their commits back to their branch:
```bash
git push origin <their-branch-name>
# Example: git push origin LaxyaRicha
```
*(Now their changes are safe on GitHub, ready for you to review and merge into master via a Pull Request!)*

---

## 7. Advanced Cleanup & Synchronization Commands

These are the commands we used to clean up the helpbook files and synchronize them across all branches:

### Stop Tracking a File (Without Deleting It)
If a file was committed by accident and you want to keep it locally but remove it from GitHub and Git tracking:
1. Add it to your `.gitignore` first.
2. Run:
   ```bash
   git rm --cached <file-name>
   # Example: git rm --cached command_helpbook.md
   ```

### Copy a File from Another Branch
If you want to copy the exact version of a file (like `.gitignore`) from another branch without switching your active branch:
```bash
git checkout <source-branch> -- <file-path>
# Example: git checkout HiteshiSaanvi -- .gitignore
```

### Reset Local Branch to Match Remote Branch
If you made local mistakes and want to completely throw them away and match GitHub's version of the branch:
```bash
git reset --hard origin/<branch-name>
# Example: git reset --hard origin/master
```

### View Files in a Remote Branch on GitHub
To list all tracked files in a specific remote branch without checking it out:
```bash
git ls-tree -r origin/<branch-name> --name-only
# Example: git ls-tree -r origin/master --name-only
```



