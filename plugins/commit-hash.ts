export default defineNuxtPlugin(nuxtApp => {
    fetch('/commit-hash.txt')
        .then(res =>  res.text()
            .then(txt => inject('commitHash', txt.trim())));
});
