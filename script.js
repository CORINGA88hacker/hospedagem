
const storage = firebase.storage();
const folderListEl = document.getElementById("folderList");
const selectedFolderEl = document.getElementById("selectedFolder");
const galleryEl = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

let folders = new Set();

function createFolder() {
  const folder = document.getElementById("newFolder").value.trim();
  if (!folder || folders.has(folder)) return;
  folders.add(folder);
  updateFolderUI();
}

function updateFolderUI() {
  folderListEl.innerHTML = "";
  selectedFolderEl.innerHTML = "";
  folders.forEach(folder => {
    const li = document.createElement("li");
    li.textContent = folder;
    li.onclick = () => {
      selectedFolderEl.value = folder;
      loadImages();
    };
    folderListEl.appendChild(li);

    const option = document.createElement("option");
    option.value = folder;
    option.textContent = folder;
    selectedFolderEl.appendChild(option);
  });
}

function uploadImages() {
  const folder = selectedFolderEl.value;
  const files = document.getElementById("imageInput").files;
  if (!folder || files.length === 0) return alert("Selecione pasta e imagens");
  Array.from(files).forEach(file => {
    const ref = storage.ref(`imagens/${folder}/${file.name}`);
    ref.put(file).then(loadImages);
  });
}

function loadImages() {
  const folder = selectedFolderEl.value;
  if (!folder) return;
  const listRef = storage.ref(`imagens/${folder}`);
  galleryEl.innerHTML = "<p>Carregando imagens...</p>";
  listRef.listAll().then(res => {
    galleryEl.innerHTML = "";
    res.items.forEach(item => {
      item.getDownloadURL().then(url => {
        const img = document.createElement("img");
        img.src = url;
        img.onclick = () => openLightbox(url);
        img.title = item.name;

        const btn = document.createElement("button");
        btn.textContent = "Excluir";
        btn.onclick = () => {
          storage.ref(item.fullPath).delete().then(loadImages);
        };

        const div = document.createElement("div");
        div.style.position = "relative";
        div.appendChild(img);
        div.appendChild(btn);
        galleryEl.appendChild(div);
      });
    });
  });
}

function openLightbox(url) {
  lightbox.style.display = "flex";
  lightboxImg.src = url;
}

function closeLightbox() {
  lightbox.style.display = "none";
}
