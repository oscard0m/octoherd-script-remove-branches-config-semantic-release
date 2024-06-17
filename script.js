// @ts-check
import { composeCreateOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";

/**
 * remove 'release.branches' from Semantic Release (https://github.com/semantic-release/semantic-release)  configuration in package.json
 *
 * @param {import('@octoherd/cli').Octokit} octokit
 * @param {import('@octoherd/cli').Repository} repository
 */
export async function script(octokit, repository) {
  if (!repository.owner) {
    throw new Error("repository must have an 'owner' associated");
  }

  const owner = repository.owner.login;
  const repo = repository.name;

  if (repository.archived) {
    octokit.log.info(
      { owner, repo, updated: false },
      `${repository.html_url} is archived`
    );
    return;
  }

  const { updated, data } = await composeCreateOrUpdateTextFile(octokit, {
    owner,
    repo,
    path: "package.json",
    content: ({ exists, content }) => {
      if (!exists) {
        return content;
      }

      let jsonFile = JSON.parse(content);

      if (!jsonFile.release || !jsonFile.release.branches) {
        return content;
      }

      delete jsonFile.release.branches;

      if (Object.keys(jsonFile.release).length === 0) {
        delete jsonFile.release;
      }

      return JSON.stringify(jsonFile, null, "  ") + "\n";
    },
    message:
      "ci(semantic-release): remove 'release.branches' configuration from package.json",
  });

  if (!updated) {
    octokit.log.info(
      { owner, repo, updated },
      "no changes applied to package.json"
    );

    return;
  }

  if (data.commit) {
    octokit.log.info(
      { owner, repo, updated },
      `Removed 'release' key from 'package.json' in ${data.commit.html_url}`
    );
  } else {
    octokit.log.info(
      { owner, repo, updated },
      `Removed 'release' key from 'package.json'`
    );
  }
}
