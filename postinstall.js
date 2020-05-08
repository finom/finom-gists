const { writeFile, mkdir } = require('fs').promises;
const fetch = require('node-fetch');

async function go() {
  const gists = await (await fetch('https://api.github.com/users/finom/gists')).json();

  for(const { files, description } of gists) {
    const match = description.match(/\[finom\/([a-z-]*)\](.*)/, '$1');
    if(match) {
      const [, name] = match;
      const filesArr = Object.values(files);
      const firstFileName = filesArr[0].filename;
      const dir = __dirname + '/' + name;

      try { await mkdir(dir); } catch(e) {}

      for(const { filename, raw_url } of filesArr) {
        const code = await (await fetch(raw_url)).text();
        await writeFile(dir + '/' + filename, code)
      }
    }
  }
}


go();
