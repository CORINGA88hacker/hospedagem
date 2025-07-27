
const firebaseConfig = {
  apiKey: "AIzaSyBHIc2E4XwRO5FXo4uHlTQVRArOis73MjE",
  authDomain: "projeto-deus-yato-928-sk-default-rtdb.firebaseapp.com",
  projectId: "projeto-deus-yato-928-sk-default-rtdb",
  storageBucket: "projeto-deus-yato-928-sk-default-rtdb.appspot.com",
  messagingSenderId: "790408726854",
  appId: "1:790408726854:android:e2f0de7b7d5dba96b0fd47"
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

let currentFolder = "";
const folders = new Set();

function createFolder() {
  const folder = document.getElementById("folderName").value.trim();
  if (!folder) return alert("Digite um nome para a pasta");

  const placeholderRef = storage.ref(`imagens/${folder}/.placeholder.txt`);
  const blob = new Blob(["pasta criada"], { type: "text/plain" });

  placeholderRef.put(blob).then(() => {
    folders.add(folder);
    updateFolderUI();
    alert("✅ Pasta criada com sucesso!");
  });
}

function updateFolderUI() {
  const container = document.getElementById("folders");
  container.innerHTML = "";
  folders.forEach(folder => {
    const btn = document.createElement("button");
    btn.textContent = folder;
    btn.onclick = () => loadImages(folder);
    container.appendChild(btn);
  });
}

function uploadImage() {
  const file = document.getElementById("imageUpload").files[0];
  if (!file || !currentFolder) return alert("Selecione uma pasta e uma imagem");

  const ref = storage.ref(`imagens/${currentFolder}/${file.name}`);
  ref.put(file).then(() => {
    alert("✅ Imagem enviada!");
    loadImages(currentFolder);
  });
}

function loadImages(folder) {
  currentFolder = folder;
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const listRef = storage.ref(`imagens/${folder}`);
  listRef.listAll().then(res => {
    res.items.forEach(itemRef => {
      if (itemRef.name === ".placeholder.txt") return;
      itemRef.getDownloadURL().then(url => {
        const img = document.createElement("img");
        img.src = url;
        gallery.appendChild(img);
      });
    });
  });
}

// Carregar pastas já criadas
function loadFolders() {
  const listRef = storage.ref("imagens");
  listRef.listAll().then(res => {
    res.prefixes.forEach(folderRef => {
      folders.add(folderRef.name);
    });
    updateFolderUI();
  });
}
loadFolders();
