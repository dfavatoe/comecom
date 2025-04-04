## Collaborative GitHub

Let's create a project [together](https://medium.com/@jonathanmines/the-ultimate-github-collaboration-guide-df816e98fb67)! BYO laptop and GitHub account 💻

- I will create a new Project and initialize a GitHub repo. Commit, Stage, Publish.

- If something changes in the remote repo, my local copy is now behind. I can **synchronise** my local copy with the remote repo in the source control using the 🔁 symbol, or by running the command `git pull`.

- In Remote repo settings, I can manage access and invite all collaborators. Send me your GitHub usernames!

- You should receive an email, please accept my invitation to collaborate.

- Now make a local clone of the repo. The green button **Code** will give you a link that you can copy. Run the command `git clone <link you copied>`. You'll likely need to `cd` into the right folder.

- Right now you are on the main branch. If I make a change and push to the main branch, your local branch is now out of date. Run the same `git pull` command that I did to see the updates appear locally.

## Issues

- Let's create some **Issues**. Think of an Issue like a task that needs completing, such as a new feature, or a bug fix. This functionality is free for everyone to use - anyone can create a new Issue and assign it to themself or a fellow collaborator. Pair up, create an issue, then assign it to your buddy - they will do the same for you in return.

- To work on your Issue, create a branch. Give it a name that includes the Issue # so we know what you're working on. VSCode usually automatically moves you to that branch, but you can check which branch you are on at the bottom left corner. If you want to change, either click there and then select the branch from the drop-down that appears. Alternatively, you can use the command `git checkout <branch name>`.

- Publish your branch. Make your changes, making sure any commits you make also include the Issue # together with your comment. Now push your commits.

- Your contribution is ready to be merged. On GitHub, we can all see your branch. For your branch, compare the changes and make a pull request, then request your buddy **review** your changes. Review your own buddy's changes - if there are no conflicts, proceed with the merge.

- It's best practise to delete the branch after it has been successfully merged. GitHub will prompt you to do this, which will delete the remote version, but you'll still have a local copy of your branch on your machine. To delete the local version, use the command `git branch --delete <branch name>`. Also make sure to Synchronise the _main_ branch with `git pull`.

- You can also now comment and close your Issue.

## Conflicts

- Let's create and [resolve](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts) a conflict.........

- Github won't let you merge a branch with conflicting changes. If the conflicts are simple, you can resolve them directly on GitHub using their **Conflict Editor**. This is an online code editor, the conflicting lines will be indicated with `<<<<<<<`, `=======`, `>>>>>>>` (these symbols are just to find your place, you should delete them before saving). Each conflict will have it's own set of markers. Once you're satisfied with your changes, click **Mark as resolved**. Once all conflicts have been resolved, you can click **Commit merge**.

- If the conflicts are more complicated, or you just simply prefer using VSCode over the online editor, you can run some commands to trigger the same indicators in VSCode. You'll first need to `git pull origin main` to synchronise your main branch with the online repo. If you're not already on the working branch, `git checkout <branch name>` to it. At this point you should already see the conflicts. If not, run `git merge main` to trigger the conflict indicators. Now you see all the conflicts, you can either make manual changes to resolve them, or view the merge editor in VSCode. This gives you side by side comparisons from which you can choose which combination of changes to keep/ignore. Commit, then push the changes by running `git push -u origin <branch name>`. Your pull request on GitHub will automatically update to reflect whether the merge is now conflict free.

- An alternative good practise is to create what is known as a **staging** branch. You would run the `git pull origin main` to get the most up-to-date version of the main branch, then make a new branch called "staging". Now, locally merge your working branch into the staging branch. You can now attempt to resolve all merge conflicts with the staging branch, knowing there's no risk of affecting the main. Once all conflicts are resolved, publish the staging branch and create a pull request.

- All of these changes we have been made independently. It's a good practise to offer your branch to be **reviewed** before actually merging the changes. Another collaborator, team lead, or even an assigned "merge master" are all possibilities. This means you would not merge your own changes, you make a pull request and then request review. Here, even if there are no actual conflicts, change requests can be made which must be addressed before the merge will be approved.

## Creating a Navbar exercise

Let's repeat the process from scratch doing a little exercise, in which we can create a Navbar for our project.

1. **Create & Push Feature Branch**

   ```bash
   # Start from updated main branch
   git checkout main
   git pull origin main

   # Create and switch to new branch
   git switch -c feature-navbar

   # Add navbar code to html file

   # Stage, commit, and push
   git add .
   git commit -m "Add navbar component"
   git push -u origin feature-navbar  # -u sets upstream
   ```

2. **Merge into Main** (Two Options)

   - **A)** GitHub Pull Request (Recommended for your team work):

     1. On Github:
        - Go to repo → Pull Requests → New Pull Request.
        - Set `base: main` ← `compare: feature-navbar`.
        - Review changes → Create PR → Merge PR.
     2. Locally:

        ```bash
        git checkout main
        git pull origin main  # Get merged changes
        ```

   - **B)** Local Merge:

     ```bash
     git checkout main
     git pull origin main  # Get merged changes
     ```

3. **Delete Branches Everywhere**

   - Delete Remote Branch (GitHub)

     ```bash
     git push origin --delete feature-navbar
     ```

   - Delete Local Branch

     ```bash
     git branch -d feature-navbar # Use -D instead of -d if branch wasn't merged
     ```

   - Clean Up VSCode Remote Tracking

     ```bash
     git fetch # to update remote branches
     ```

4. **Verify Cleanup**

   ```bash
   git branch -a  # Should show no feature-navbar
   git fetch --prune  # Cleans up stale remote refs
   ```
