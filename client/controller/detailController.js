/**
 * @fileoverview Contrôleur pour la page de détail d'une moto - Affichage dynamique des informations et des pièces
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

import { ServiceGarage } from "../service/serviceGarage.js";
import { ServiceLogistique } from "../service/serviceLogistique.js";

/**
 * Contrôleur pour la page de détail d'une moto.
 * Gère l'affichage dynamique des informations et des pièces.
 * @class
 */
class DetailController {
  /**
   * Initialise l'affichage de la page de détail d'une moto.
   * Coordonne l'appel des différentes méthodes pour afficher les informations complètes.
   * @static
   * @async
   * @returns {Promise<void>}
   */
  static async init() {
    const detail = JSON.parse(localStorage.getItem('detail_moto'));
    if (!detail) return;
    this.remplirTitre(detail);
    this.afficherImage(detail);
    this.remplirInfos(detail);
    const stockMap = await this.getStockMap();
    this.remplirTableauPieces(detail, stockMap);
    this.ajouterSuppression(detail);
  }

  /**
   * Remplit le titre de la page avec le nom du modèle de la moto.
   * @static
   * @param {Object} detail - Détails de la moto
   * @param {string} detail.nomModele - Nom du modèle de la moto
   */
  static remplirTitre(detail) {
    const titre = document.querySelector('.detail-gauche h1');
    if (titre) titre.textContent = detail.nomModele;
  }

  /**
   * Affiche l'image correspondant au modèle de la moto.
   * Teste plusieurs extensions possibles pour trouver l'image.
   * @static
   * @param {Object} detail - Détails de la moto
   * @param {string} detail.nomModele - Nom du modèle de la moto
   */
  static afficherImage(detail) {
    const imgMoto = document.querySelector('.detail-moto-img img');
    if (imgMoto && detail.nomModele) {
      const baseName = detail.nomModele.trim();
      const extensions = [".PNG", ".png", ".JPG", ".jpg", ".JPEG", ".jpeg"];
      let found = false;
      for (let ext of extensions) {
        const path = `../image/${baseName}${ext}`;
        const testImg = new window.Image();
        testImg.onload = function() {
          if (!found) {
            imgMoto.src = path;
            found = true;
          }
        };
        testImg.src = path;
      }
    }
  }

  /**
   * Remplit les informations de base de la moto (date, client, ID).
   * Formate la date de livraison si nécessaire.
   * @static
   * @param {Object} detail - Détails de la moto
   * @param {string} detail.dateLivraison - Date de livraison de la moto
   * @param {string} detail.nomClient - Nom du client
   * @param {number} detail.pk_moto - ID de la moto
   */
  static remplirInfos(detail) {
    const infoSpans = document.querySelectorAll('.detail-info-moto span');
    if (infoSpans.length >= 3) {
      let dateStr = detail.dateLivraison;
      if (dateStr && dateStr.includes('T')) {
        const dateObj = new Date(dateStr);
        dateStr = dateObj.toLocaleDateString('fr-CH', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Europe/Zurich' });
        dateStr = dateStr.split('.').reverse().join('-');
      }
      infoSpans[0].textContent = `Date : ${dateStr}`;
      infoSpans[1].textContent = `Client : ${detail.nomClient}`;
      infoSpans[2].textContent = `ID : ${detail.pk_moto}`;
    }
  }

  /**
   * Récupère les informations de stock pour toutes les pièces.
   * @static
   * @async
   * @returns {Promise<Object>} Mapping des noms de pièces vers leur quantité en stock
   */  static async getStockMap() {
    let stockMap = {};
    try {
      const logistiqueService = new ServiceLogistique();
      const stockPieces = await logistiqueService.getPieces();
      stockPieces.forEach(piece => {
        stockMap[piece.nomPiece.trim().toLowerCase()] = piece.quantiteStock;
      });
    } catch (e) {
      // Si erreur, on laisse le stock à 0
    }
    return stockMap;
  }

  /**
   * Remplit le tableau des pièces associées à la moto et ajoute les handlers d'événements.
   * Applique un code couleur selon le niveau de stock disponible.
   * @static
   * @param {Object} detail - Détails de la moto
   * @param {Array} detail.pieces - Liste des pièces de la moto
   * @param {Object} stockMap - Mapping des noms de pièces vers leur quantité en stock
   */
  static remplirTableauPieces(detail, stockMap) {
    const tbody = document.querySelector('.detail-table tbody');
    if (tbody && Array.isArray(detail.pieces)) {
      tbody.innerHTML = '';
      detail.pieces.forEach(piece => {
        const key = piece.nomPiece.trim().toLowerCase();
        const stock = stockMap[key] !== undefined ? stockMap[key] : 0;
        let stockClass = 'stock-green';
        if (stock < 5) stockClass = 'stock-red';
        else if (stock < 20) stockClass = 'stock-orange';
        tbody.innerHTML += `
          <tr data-piece-id="${piece.pk_piece}">
            <td>${piece.nomPiece}</td>
            <td class="${stockClass}">${stock}</td>
            <td>${piece.quantite}</td>
            <td><button class="btn-monter-piece">Monter la pièce</button></td>
          </tr>
        `;
      });
      tbody.querySelectorAll('.btn-monter-piece').forEach(btn => {
        btn.addEventListener('click', function() {
          const tr = btn.closest('tr');
          const pieceId = tr.getAttribute('data-piece-id');
          const idMoto = detail.pk_moto;
          DetailController.monterPiece(idMoto, pieceId);
        });
      });
    }
  }

  /**
   * Ajoute la fonctionnalité de suppression de moto à la page.
   * @static
   * @param {Object} detail - Détails de la moto
   * @param {number} detail.pk_moto - ID de la moto
   */
  static ajouterSuppression(detail) {
    const btnSupprimer = document.getElementById('btn-supprimer-moto');    if (btnSupprimer && detail && detail.pk_moto) {
      btnSupprimer.addEventListener('click', async () => {
        if (confirm('Voulez-vous vraiment supprimer cette moto ?')) {
          try {
            const garageService = new ServiceGarage();
            await garageService.supprimerMoto(detail.pk_moto);
            alert('Moto supprimée avec succès.');
            window.location.href = './garage.html';
          } catch (e) {
            alert('Erreur lors de la suppression de la moto : ' + e.message);
          }
        }
      });
    }
  }

  /**
   * Monte une pièce sur une moto (supprime la pièce de la liste).
   * @static
   * @param {number} idMoto - ID de la moto
   * @param {number} idPiece - ID de la pièce
   */  static monterPiece(idMoto, idPiece) {
    if (!idMoto || !idPiece) return;
    
    const garageService = new ServiceGarage();
    garageService.supprimerPieceDeMoto(idMoto, idPiece)
      .then(() => {
        return garageService.getMotoDetail(idMoto);
      })
      .then((nouveauDetail) => {
        localStorage.setItem('detail_moto', JSON.stringify(nouveauDetail));
        location.reload();
      })
      .catch((err) => {
        alert('Erreur lors du montage de la pièce: ' + err.message);
      });
  }
  }


// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  DetailController.init();
});