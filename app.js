// Album Class: Represents an Album
class Album {
    constructor(title, artist, year, catalogNum) {
        this.title = title;
        this.artist = artist;
        this.year = year;
        this.catalogNum = catalogNum;
    }
}

// UI Class: Handles UI Tasks
class UI {
    static displayAlbums() {
        const albums = Store.getAlbums();

        albums.forEach(album => UI.addAlbumToList(album));
    }

    static addAlbumToList(album) {
        const list = document.querySelector('#album-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${album.title}</td>
        <td>${album.artist}</td>
        <td>${album.year}</td>
        <td>${album.catalogNum}</td>
        <td><a href="#" class="btn btn-outline-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static deleteAlbum(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#album-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#artist').value = '';
        document.querySelector('#year').value = '';
        document.querySelector('#catalogNum').value = '';
    }
}

// Store Class: Handles Storange
class Store {
    static getAlbums() {
        let albums;
        if (localStorage.getItem('albums') === null) {
            albums = [];
        } else {
            albums = JSON.parse(localStorage.getItem('albums'));
        }
        return albums;
    }

    static addAlbum(album) {
        const albums = Store.getAlbums();

        albums.push(album);

        localStorage.setItem('albums', JSON.stringify(albums));
    }

    static removeAlbum(catalogNum) {
        const albums = Store.getAlbums();

        albums.forEach((album, index) => {
            if (album.catalogNum === catalogNum) {
                albums.splice(index, 1);
            }
        });

        localStorage.setItem('albums', JSON.stringify(albums));
    }
}

// Event: Display Albums
document.addEventListener('DOMContentLoaded', UI.displayAlbums);

// Event: Add an Album
document.querySelector('#album-form').addEventListener('submit', e => {
    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const artist = document.querySelector('#artist').value;
    const year = document.querySelector('#year').value;
    const catalogNum = document.querySelector('#catalogNum').value;

    // Validation
    if (title === '' || artist === '' || year === '' || catalogNum == '') {
        UI.showAlert('Please complete all fields', 'danger');
    } else {
        // Instantiate Album
        const album = new Album(title, artist, year, catalogNum);

        // Add Album to UI
        UI.addAlbumToList(album);

        // Add Album to Store
        Store.addAlbum(album);

        // Show success message
        UI.showAlert('Album added', 'success');

        // Clear the fields
        UI.clearFields();
    }
});

// Event: Remove an Album
document.querySelector('#album-list').addEventListener('click', e => {
    // Remove Album from UI
    UI.deleteAlbum(e.target);

    // Remove Album from Store
    Store.removeAlbum(
        e.target.parentElement.previousElementSibling.textContent
    );

    // Show delete message
    UI.showAlert('Album removed', 'info');
});
