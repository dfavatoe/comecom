# Git commands and concepts

## Pull

"Pull" is when you get the latest changes from a remote repository (like GitHub) and merge them into your local repository. Imagine your friend has updated a shared document online, and you want to download those updates to your own copy.

## Merge

"Merge" is when you combine changes from one branch into another branch. Think of it like merging two versions of a document into one final version that includes changes from both.

In Git is the process of integrating changes from one branch into another.
If we are in a branch called `feature-branch` (e.g. "login-branch", "register-branch") , the coomand `git merge main` will attemt to merge into the main branch, the new elements existing in the `feature-branch`, or in other words, to include the changes of `feature-branch` inside `main` branch.

There are different situations when merging. Let's describe the 2 most common ones :

- Fast-Forward Merge:
  this happens when, prior to the merge, the `main branch` (the target branch, in this example) has no changes (new commits) since we created the `feature branch`.
  In this situation, merging `feature-branch` into `main` (by running `git merge main` while being in `feature branch`) will just move the main branch pointer forward to the latest commit in feature-branch.

- Three-Way Merge:
  This is the typical merge scenario where both branches have diverged.
  We created a `feature branch` that is a exact copy of `main branch`, but while working in our feature branch, there had been new commits made into the `main branch`.
  When we commit the changes of the `feature-branch` and we try to merge it into the main, that will create a \*_conflict_.
  Git will pause the merge process and allow you to manually resolve the conflicts. You'll decide how to combine the differing changes, then commit the result.
  In this scenario, Git uses the common ancestor of the branches and the changes from both branches to create a new merge commit.

Example :

1. You have a `main` branch with commits A and B.

```css
A - B (main)
```

2. Crete a `feature branch` and move to it

```powershell
git checkout -b feature-branch
```

3. We work on `feature branch` and make new commits C and D.

```css
A - B (main)
     \
      C - D (feature-branch)
```

4. We move back to `main` , work there and make commits E and F.

```css
git checkout main

A - B - E - F (main)
     \
      C - D (feature-branch)
```

5. we want to merge `feature branch` into `main`

```sh
git merge feature-branch
```

6. After we resolve the conflicts, when we commit and push, Git creates a new merge commit G that combines changes from both branches.

```css
A - B - E - F - G (main)
     \       /
      C - D (feature-branch)
```

_commit G_ is a merge commit that has two parent commits: _F_ from the main branch and _D_ from the feature branch.

![image](./merge_Ways.png)

## other git commands

- `git checkout branchName` : switches your working directory to the branch or commit named _branchName_. It's like switching to a different version of your document.

- `git pull origin branchName` : This command pulls changes from the branch named _branchName_ on the remote repository called _origin_ and merges them into your current branch. "origin" is usually the default name for your remote repository (`origin main` , `origin feature-branch`, etc... )

- `git branch --delete branchName` : This command deletes the branch named branchName from your local repository. It's like removing a version of a document you no longer need.

- `git fetch` : This command downloads the latest changes from the remote repository but doesn't merge them into your local branches. It's like checking if there are updates to the shared document without actually incorporating them into your copy yet.

- `git fetch --prune` : This command fetches the latest changes from the remote repository and also removes references to branches that have been deleted on the remote. It's like updating your local list of versions to match the shared document's list, removing any versions that no longer exist.

### how to revert the last comit already pushed to github

If you already commited and pushed to github, and you regret doing it, you can follow these steps to undo it.

1. **Undo the commit locally** (soft reset keeps changes in working directory):

   ```bash
       git reset --soft HEAD~1  # Undo last commit, keep changes
       # OR
       git reset --hard HEAD~1 # for hard reset (discard changes) AND jump to Step 4

   ```

   - `--hard`: Discards both the commit and all changes from the working directory.
   - `HEAD~1`: Targets the previous commit
   - 💻 in VSCode → Commit → Undo Last Commit

2. **Unstage any remaining files**

   ```bash
       git restore --staged .  # For Git 2.23 and higher
       # For older Git versions:
       git reset HEAD .
       # OR
       git checkout .
   ```

   💻 in VSCode → Changes → Unstage All Changes

3. **Delete changes** (optional):

   ```bash
        git checkout -- .
        # OR
       git clean -df
   ```

   💻 in VSCode → Changes → Discard All Changes

4. **Force-push to GitHub**

   ```bash
       git push origin main --force
       # OR
       git push origin -f
       # Or if using a different branch:
       git push origin your-branch-name --force
   ```
