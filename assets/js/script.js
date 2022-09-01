const storageKey = 'STORAGE_KEY';

const formTambahBuku = document.getElementById('inputBook');
const formCariBuku = document.getElementById('searchBook');

function CheckForStorage() {
    return typeof(Storage) !== 'undefined';
}

formTambahBuku.addEventListener('submit', function (event) {
    const judul = document
        .getElementById('inputBookTitle')
        .value;
    const penulis = document
        .getElementById('inputBookAuthor')
        .value;
    const tahun = parseInt(document.getElementById('inputBookYear').value);
    const isComplete = document
        .getElementById('inputBookIsComplete')
        .checked;

    const idB = document
        .getElementById('inputBookTitle')
        .name;
    if (idB !== '') {
        const dataBuku = getBuku();
        for (let i = 0; i < dataBuku.length; i++) {
            if (dataBuku[i].id == idB) {
                dataBuku[i].title = judul;
                dataBuku[i].author = penulis;
                dataBuku[i].year = tahun;
                dataBuku[i].isComplete = isComplete;
            }
        }
        localStorage.setItem(storageKey, JSON.stringify(dataBuku));
        resetForm();
        renderBuku(dataBuku);
        return;
    }

    const id = JSON.parse(localStorage.getItem(storageKey)) === null
        ? 0 + Date.now()
        : JSON
            .parse(localStorage.getItem(storageKey))
            .length + Date.now();
    const bukuBaru = {
        id: id,
        title: judul,
        author: penulis,
        year: tahun,
        isComplete: isComplete
    };
    setBuku(bukuBaru);

    const dataBuku = getBuku();
    renderBuku(dataBuku);
});

function setBuku(data) {
    if (CheckForStorage()) {
        let dataBuku = [];

        if (localStorage.getItem(storageKey) !== null) {
            dataBuku = JSON.parse(localStorage.getItem(storageKey));
        }

        dataBuku.push(data);
        localStorage.setItem(storageKey, JSON.stringify(dataBuku));
    }
}

function renderBuku(dataBuku) {
    if (dataBuku === null) 
        return;
    
    const belumSelesai = document.getElementById('incompleteBookshelfList');
    const selesaiBaca = document.getElementById('completeBookshelfList');

    belumSelesai.innerHTML = '';
    selesaiBaca.innerHTML = '';
    for (let book of dataBuku) {

        const {id, title, author, year, isComplete} = book;

        let itemBuku = document.createElement('article');
        itemBuku
            .classList
            .add('book_item', 'select_item');
        itemBuku.innerHTML = `<h3 name = ${id}  '> ${title} </h3>`;
        itemBuku.innerHTML += `<p>Penulis: ${author} </p>`;
        itemBuku.innerHTML += `<p>Tahun Terbit: ${year} </p>`;

        //action button selesai dan hapus buku
        let actionButton = document.createElement('div');
        actionButton
            .classList
            .add('action');

        //tombol selesai
        const greenButton = tombolSelesai(book, function (event) {
            tombolSelesaiHandler(event.target.parentElement.parentElement);

            const dataBuku = getBuku();
            resetForm();
            renderBuku(dataBuku);
        });

        //tombol hapus buku
        const redButton = hapusBuku(function (event) {
            deleteItem(event.target.parentElement.parentElement);

            const dataBuku = getBuku();
            resetForm();
            renderBuku(dataBuku);
        });

        actionButton.append(greenButton, redButton);
        itemBuku.append(actionButton);

        if (isComplete === false) {
            belumSelesai.append(itemBuku);
            continue;
        }
        selesaiBaca.append(itemBuku);
    }
}

function tombolSelesai(buku, eventListener) {
    const isComplete = buku.isComplete
        ? 'Belum selesai'
        : 'Selesai';

    const greenButton = document.createElement('button');
    greenButton
        .classList
        .add('green');
    greenButton.innerText = isComplete + ' dibaca';
    greenButton.addEventListener('click', function () {
        eventListener(event);
    });
    return greenButton;
}

function hapusBuku(eventListener) {
    const redButton = document.createElement('button');
    redButton
        .classList
        .add('red');
    redButton.innerText = 'Hapus buku';
    redButton.addEventListener('click', function (event) {
        eventListener(event);
    });
    return redButton;
}

function tombolSelesaiHandler(itemElement) {
    const dataBuku = getBuku();
    if (dataBuku.length === 0) {
        return;
    }

    const title = itemElement
        .childNodes[0]
        .innerText;
    const titleNameAttribut = itemElement
        .childNodes[0]
        .getAttribute('name');
    for (let i = 0; i < dataBuku.length; i++) {
        if (dataBuku[i].title === title && dataBuku[i].id == titleNameAttribut) {
            dataBuku[i].isComplete = !dataBuku[i].isComplete;
            break;
        }
    }
    localStorage.setItem(storageKey, JSON.stringify(dataBuku));
}

function cariBuku(title) {
    const dataBuku = getBuku();
    if (dataBuku.length === 0) {
        return;
    }

    const bookList = [];

    for (let i = 0; i < dataBuku.length; i++) {
        const tempTitle = dataBuku[i]
            .title
            .toLowerCase();
        const tempTitleTarget = title.toLowerCase();
        if (dataBuku[i].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
            bookList.push(dataBuku[i]);
        }
    }
    return bookList;
}

function greenButton(parentElement) {
    let buku = tombolSelesaiHandler(parentElement);
    buku.isComplete = !buku.isComplete;
}

function getBuku() {
    if (CheckForStorage) {
        return JSON.parse(localStorage.getItem(storageKey));
    }
    return [];
}

function deleteItem(itemElement) {
    const dataBuku = getBuku();
    if (dataBuku.length === 0) {
        return;
    }

    const titleName = itemElement
        .childNodes[0]
        .getAttribute('name');
    for (let i = 0; i < dataBuku.length; i++) {
        if (dataBuku[i].id == titleName) {
            dataBuku.splice(i, 1);
            break;
        }
    }

    localStorage.setItem(storageKey, JSON.stringify(dataBuku));
}

searchBook.addEventListener('submit', function (event) {
    event.preventDefault();
    const dataBuku = getBuku();
    if (dataBuku.length === 0) {
        return;
    }

    const title = document
        .getElementById('searchBookTitle')
        .value;
    if (title === null) {
        renderBuku(dataBuku);
        return;
    }
    const bookList = cariBuku(title);
    renderBuku(bookList);
});

function resetForm() {
    document
        .getElementById('inputBookTitle')
        .value = '';
    document
        .getElementById('inputBookAuthor')
        .value = '';
    document
        .getElementById('inputBookYear')
        .value = '';
    document
        .getElementById('inputBookIsComplete')
        .checked = false;

    document
        .getElementById('searchBookTitle')
        .value = '';
}

window.addEventListener('load', function () {
    if (CheckForStorage) {
        if (localStorage.getItem(storageKey) !== null) {
            const dataBuku = getBuku();
            renderBuku(dataBuku);
        }
    } else {
        alert('Browser yang Anda gunakan tidak mendukung Web Storage');
    }
});