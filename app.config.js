const { execSync } = require('child_process');

// Hash do commit que originou este build. No EAS Build ele vem da variavel de ambiente;
// localmente (expo start / build local) e lido do git. Aparece na tela "Sobre o App".
const git = (command) => {
  try {
    return execSync(`git ${command}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
};

const commitHash = process.env.EAS_BUILD_GIT_COMMIT_HASH || git('rev-parse HEAD') || 'desconhecido';
const commitDirty = !process.env.EAS_BUILD_GIT_COMMIT_HASH && git('status --porcelain') !== '';

// Momento em que a configuracao foi avaliada: no EAS Build, e a data do build do APK.
const buildDate = new Date().toISOString();

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash,
    commitDirty,
    buildDate,
  },
});
