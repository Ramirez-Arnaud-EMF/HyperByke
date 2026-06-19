/**
 * @fileoverview Contrôleur pour la gestion du garage (motos) - affichage, ajout, navigation détail
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

/**
 * Contrôleur pour la gestion du garage (motos).
 * Gère l'affichage, l'ajout et la navigation vers le détail des motos.
 * @class
 */
import { ServiceGarage } from "../service/serviceGarage.js";
import { ServiceLogistique } from "../service/serviceLogistique.js";

class GarageController {
  /**
   * Initialise les services utilisés par ce contrôleur
   */
  constructor() {
    this.garageService = new ServiceGarage();
    this.logistiqueService = new ServiceLogistique();
  }

  /**
   * Affiche le détail d'une moto et redirige vers la page de détail.
   * Récupère les informations détaillées et les stocke dans le localStorage avant redirection.
   * @static
   * @async
   * @param {number} id - ID de la moto
   * @returns {Promise<void>}
   */
  static async afficherDetailMoto(id) {
    try {
      const garageService = new ServiceGarage();
      const detail = await garageService.getMotoDetail(id);
      // Stocker les données dans le localStorage pour la page detail
      localStorage.setItem('detail_moto', JSON.stringify(detail));
      window.location.href = '../html/detail.html';
    } catch (e) {
      alert("Erreur lors de la récupération du détail de la moto : " + e.message);
    }
  }

  /**
   * Charge la liste des motos et les affiche sous forme de cartes.
   * Gère l'affichage des images et les boutons de navigation vers les détails.
   * @static
   * @async
   * @returns {Promise<void>}
   */  static async chargerMotos() {
    const listeMotoDiv = document.getElementById("lise-moto");
    listeMotoDiv.innerHTML = "";
    try {
      const garageService = new ServiceGarage();
      const motos = await garageService.getMotos();
      motos.forEach(moto => {
        const carte = document.createElement("div");
        carte.className = "carte-moto";
        carte.innerHTML = `
          <span class="carte-moto-nom">${moto.nomModele}</span>
          <span class="carte-moto-num">${moto.pk_moto}</span>
          <div class="carte-moto-barre">
              <div class="carte-moto-progress" style="width: 60%;"></div>
          </div>
          <div class="carte-moto-img"><img style="width:48px;height:48px;object-fit:contain;" alt="${moto.nomModele}"></div>
          <button class="carte-moto-btn" data-id="${moto.pk_moto}">Voir plus</button>
        `;
        // Gestion image icon de la liste des motos
        const img = carte.querySelector('.carte-moto-img img');
        const baseName = moto.nomModele.trim();
        const extensions = [".PNG", ".png", ".JPG", ".jpg", ".JPEG", ".jpeg"];
        let found = false;
        for (let ext of extensions) {
          const path = `../image/${baseName}${ext}`;
          const testImg = new window.Image();
          testImg.onload = function() {
            if (!found) {
              img.src = path;
              found = true;
            }
          };
          testImg.src = path;
        }
        carte.querySelector('.carte-moto-btn').onclick = function() {
          GarageController.afficherDetailMoto(moto.pk_moto);
        };
        listeMotoDiv.appendChild(carte);
      });
    } catch (e) {
      listeMotoDiv.innerHTML = "<p>Erreur de chargement des motos.</p>";
    }
  }

  /**
   * Charge le stock de pièces et l'affiche dans un tableau.
   * @static
   * @async
   * @returns {Promise<void>}
   */  static async chargerStock() {
    const wrapper = document.getElementById("wrapper");
    wrapper.innerHTML = "";
    try {
      const logistiqueService = new ServiceLogistique();
      const pieces = await logistiqueService.getPieces();
      if (!pieces || pieces.length === 0) {
        wrapper.innerHTML = "<p>Aucune pièce trouvée dans le stock.</p>";
        return;
      }
      const table = document.createElement("table");
      table.className = "table-logistique";
      const thead = document.createElement("thead");
      thead.innerHTML = `
        <tr>
          <th>Pièce</th>
          <th>Stock</th>
        </tr>
      `;
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      pieces.forEach(piece => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${piece.nomPiece}</td>
          <td>${piece.quantiteStock}</td>
        `;
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      wrapper.appendChild(table);
    } catch (e) {
      wrapper.innerHTML = "<p>Erreur de chargement du stock.</p>";
    }
  }

  /**
   * Ouvre le formulaire d'ajout de moto.
   * Affiche le formulaire et masque le bouton d'ajout.
   * @static
   */
  static ouvrirFormAjoutMoto() {
    document.getElementById("form-ajouter-moto").style.display = "block";
    document.getElementById("btn-ajouter-moto").style.display = "none";
  }

  /**
   * Ferme le formulaire d'ajout de moto.
   * Masque le formulaire et réaffiche le bouton d'ajout.
   * @static
   */
  static fermerFormAjoutMoto() {
    document.getElementById("form-ajouter-moto").style.display = "none";
    document.getElementById("btn-ajouter-moto").style.display = "inline-block";
  }

  /**
   * Crée une nouvelle moto à partir des données du formulaire.
   * Valide les données avant l'ajout et rafraîchit la liste après ajout.
   * @static
   * @async
   * @returns {Promise<void>}
   */
  static async creerMoto() {
    const nomClient = document.getElementById("input-nom-client").value.trim();
    const pk_configurationMoto = parseInt(document.getElementById("input-nom-modele").value, 10);
    const dateLivraison = document.getElementById("input-date-livraison").value;
    if (!nomClient || !pk_configurationMoto || !dateLivraison) {
      alert("Veuillez remplir tous les champs.");
      return;
    }    try {
      const garageService = new ServiceGarage();
      await garageService.ajouterMoto(nomClient, pk_configurationMoto, dateLivraison);
      GarageController.fermerFormAjoutMoto();
      GarageController.chargerMotos();
    } catch (e) {
      alert("Erreur lors de l'ajout de la moto : " + e.message);
    }
  }

  /**
   * Initialise le contrôleur et tous les gestionnaires d'événements.
   * Charge les données et configure les boutons d'interaction.
   * @static
   */
  static init() {
    GarageController.chargerMotos();
    GarageController.chargerStock();
    document.getElementById("btn-ajouter-moto").onclick = GarageController.ouvrirFormAjoutMoto;
    document.getElementById("btn-retour-ajout-moto").onclick = GarageController.fermerFormAjoutMoto;
    document.getElementById("btn-creer-moto").onclick = GarageController.creerMoto;
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  GarageController.init();
});