<?php
session_start();

if (!isset($_SESSION['role'])) {
    header('Location: index.html');
    exit();
}

if ($_SESSION['role'] !== 'admin') {
    header('Location: index.html');
    exit();
}
?>


<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - BiBi.nl</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container">
        <a class="navbar-brand" href="index.html">BiBi.nl - Admin</a>
    </div>
</nav>

<div class="container mt-4">
    <h2>Admin paneel</h2>

<!-- Tabbladen -->
    <ul class="nav nav-tabs mt-3" id="adminTabs">
        <li class="nav-item">
            <a class="nav-link active" data-bs-toggle="tab" href="#boeken">Boeken</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#klanten">Klanten</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-bs-toggle="tab" href="#uitleningen">Uitleningen</a>
        </li>
    </ul>

    <div class="tab-content mt-3">

<!-- Tabblad: Boeken -->
        <div class="tab-pane fade show active" id="boeken">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4>Boeken beheren</h4>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalBoekToevoegen">
                    Boek toevoegen
                </button>
            </div>
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Titel</th>
                        <th>Auteur</th>
                        <th>Uitgever</th>
                        <th>Taal</th>
                        <th>Genre</th>
                        <th>Pagina's</th>
                        <th>Publicatiedatum</th>
                        <th>ISBN</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody id="tabel-boeken"></tbody>
            </table>
        </div>

<!-- Tabblad: Klanten -->
        <div class="tab-pane fade" id="klanten">
            <h4 class="mb-3">Klanten beheren</h4>
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Naam</th>
                        <th>Gebruikersnaam</th>
                        <th>Email</th>
                        <th>Telefoon</th>
                        <th>Aangemaakt op</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody id="tabel-klanten"></tbody>
            </table>
        </div>

<!-- Tabblad: Uitleningen -->
        <div class="tab-pane fade" id="uitleningen">
            <h4 class="mb-3">Uitleningen beheren</h4>
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>Boek</th>
                        <th>Klant</th>
                        <th>Datum uit</th>
                        <th>Datum terug</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="tabel-uitleningen"></tbody>
            </table>
        </div>

    </div>
</div>

<!-- Modal: Boek toevoegen -->
<!-- Modal: Boek toevoegen -->
<div class="modal fade" id="modalBoekToevoegen" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title">Boek toevoegen</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">

                <div id="boek-melding"></div>

                <!-- Titel -->
                <div class="mb-3">
                    <label for="boek-titel" class="form-label">Titel</label>
                    <input
    type="text"
    id="boek-titel"
    class="form-control"
    minlength="2"
    maxlength="255"
    required
>
                    <div class="invalid-feedback">
                       Minimaal 2 tekens verplicht.
                    </div>
                </div>

                <!-- Auteur -->
                <div class="mb-3">
                    <label for="boek-auteur" class="form-label">Auteur</label>
                    <input
    type="text"
    id="boek-auteur"
    class="form-control"
    minlength="2"
    maxlength="255"
    required
>
                    <div class="invalid-feedback">
                        Minimaal 2 tekens verplicht.
                    </div>
                </div>

                <!-- Uitgever -->
                <div class="mb-3">
                    <label for="boek-uitgever" class="form-label">Uitgever</label>
                    <input
    type="text"
    id="boek-uitgever"
    class="form-control"
    minlength="2"
    maxlength="255"
    required
>
                    <div class="invalid-feedback">
                        Minimaal 2 tekens verplicht.
                    </div>
                </div>

                <!-- Taal -->
                <div class="mb-3">
                    <label for="boek-taal" class="form-label">Taal</label>
                   <input
    type="text"
    id="boek-taal"
    class="form-control"
    minlength="2"
    maxlength="30"
    required
>
                    <div class="invalid-feedback">
                        Minimaal 2 tekens verplicht.
                    </div>
                </div>

                <!-- Pagina's -->
                <div class="mb-3">
                    <label for="boek-aantal-paginas" class="form-label">
                        Aantal pagina's
                    </label>

                    <input
                        type="number"
                        id="boek-aantal-paginas"
                        class="form-control"
                        min="1"
                        max="10000"
                        required
                    >

                    <div class="invalid-feedback">
                        Vul een geldig aantal pagina's in.
                    </div>
                </div>

                <!-- Genre -->
                <div class="mb-3">
                    <label for="boek-genre" class="form-label">Genre</label>

          <input
    type="text"
    id="boek-genre"
    class="form-control"
    maxlength="100"
>
                </div>

                <!-- ISBN -->
                <div class="mb-3">
                    <label for="boek-isbn" class="form-label">ISBN</label>

                    <input
    type="text"
    id="boek-isbn"
    class="form-control"
    pattern="[0-9\-]{10,20}"
    required
>

                    <div class="invalid-feedback">
    Gebruik een geldig ISBN nummer.
</div>
                </div>

                <!-- Publicatie datum -->
                <div class="mb-3">
                    <label for="boek-publicatie-datum" class="form-label">
                        Publicatie datum
                    </label>

                   <input
    type="date"
    id="boek-publicatie-datum"
    class="form-control"
    max="2026-05-20"
>
                </div>

            </div>

            <!-- FOOTER -->
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Annuleren
                </button>

                <button
                    type="button"
                    class="btn btn-primary"
                    onclick="boekToevoegen()"
                >
                    Opslaan
                </button>
            </div>

        </div>
    </div>
</div>

<!-- Modal: Klant bewerken -->
<div class="modal fade" id="modalKlantBewerken" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Klant bewerken</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div id="edit-klant-melding"></div>
                <input type="hidden" id="edit-klant-id">
                <div class="mb-3">
                    <label class="form-label">Voornaam</label>
                    <input type="text" id="edit-voornaam" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Achternaam</label>
                    <input type="text" id="edit-achternaam" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Gebruikersnaam</label>
                    <input type="text" id="edit-gebruikersnaam" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" id="edit-email" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Telefoon</label>
                    <input type="text" id="edit-telefoon" class="form-control">
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" id="edit-is-admin" class="form-check-input">
                    <label class="form-check-label">Admin rechten</label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuleren</button>
                <button type="button" class="btn btn-primary" onclick="klantOpslaan()">Opslaan</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script src="js/admin.js"></script>
</body>
</html>