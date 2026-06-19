/**
 * @fileoverview Contrôleur pour la gestion logistique (stock de pièces) - affichage, commande, modification
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

/**
 * Contrôleur pour la gestion logistique (stock de pièces).
 * Gère l'affichage, la commande et la modification des pièces.
 * @class
 */
import { ServiceLogistique } from "../service/serviceLogistique.js";

class LogistiqueController {
  /**
   * Initialise le contrôleur et charge le tableau des pièces.
   * Point d'entrée principal pour la gestion logistique.
   * @static
   * @async
   * @returns {Promise<void>}
   */
  static async init() {
    await this.refreshTable();
  }

  /**
   * Recharge le tableau des pièces.
   * Gère les erreurs d'authentification et autres problèmes de communication avec le serveur.
   * @static
   * @async
   * @returns {Promise<void>}
   */  static async refreshTable() {
    try {
      const logistiqueService = new ServiceLogistique();
      const pieces = await logistiqueService.getPieces();
      if (!pieces || pieces.length === 0) {
        document.getElementById("wrapper").innerHTML = "<p>Aucune pièce trouvée dans le stock.</p>";
        return;
      }
      LogistiqueController.creerTableauLogistique(pieces);
    } catch (e) {
      console.error("Erreur lors du chargement des données:", e);
      if (e.message.includes('401') || e.message.includes('403')) {
        document.getElementById("wrapper").innerHTML = "Erreur d'authentification. Veuillez vous connecter.";
      } else if (e.message.includes('404')) {
        document.getElementById("wrapper").innerHTML = "Endpoint non trouvé. Vérifiez que le serveur est démarré.";
      } else {
        document.getElementById("wrapper").innerHTML = `Erreur de chargement des données: ${e.message}`;
      }
    }
  }

  /**
   * Crée le tableau HTML du stock logistique.
   * Génère un tableau interactif avec les fonctionnalités de commande et modification.
   * @static
   * @param {Object[]} pieces - Liste des pièces
   * @param {string} pieces[].nomPiece - Nom de la pièce
   * @param {number} pieces[].quantiteStock - Quantité en stock
   * @param {number} pieces[].pk_piece - ID de la pièce
   */
  static creerTableauLogistique(pieces) {
    const wrapper = document.getElementById("wrapper");
    wrapper.innerHTML = "";
    const table = document.createElement("table");
    table.className = "table-logistique";
    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>Pièce</th>
        <th>Stock</th>
        <th>Commande</th>
      </tr>
    `;
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    pieces.forEach(piece => {
      const nom = piece.nomPiece;
      const stock = piece.quantiteStock;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${nom}</td>
        <td>${stock}</td>
        <td>
          <input type="number" min="0" value="0" id="qty-${piece.pk_piece}" style="width:60px; margin-right:5px;">
          <button class="btn-commander" data-piece="${piece.pk_piece}" data-nom="${nom}">Commander</button>
          <button class="btn-modifier" data-piece="${piece.pk_piece}" data-nom="${nom}">Modifier</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrapper.appendChild(table);
    wrapper.querySelectorAll(".btn-commander").forEach(btn => {
      btn.onclick = function() {
        const pieceId = btn.dataset.piece;
        const input = document.getElementById(`qty-${pieceId}`);
        const quantite = parseInt(input.value, 10);
        LogistiqueController.commander(pieceId, quantite);
      };
    });
    wrapper.querySelectorAll(".btn-modifier").forEach(btn => {
      btn.onclick = function() {
        const pieceId = btn.dataset.piece;
        const input = document.getElementById(`qty-${pieceId}`);
        const quantite = parseInt(input.value, 10);
        LogistiqueController.modifier(pieceId, quantite);
      };
    });
  }

  /**
   * Commande une quantité de pièce.
   * Valide que la quantité est supérieure à zéro avant de passer la commande.
   * @static
   * @async
   * @param {number} pieceId - ID de la pièce
   * @param {number} quantite - Quantité à commander
   * @returns {Promise<void>}
   */  static async commander(pieceId, quantite) {
    if (quantite <= 0) {
      alert("Veuillez entrer une quantité supérieure à 0.");
      return;
    }
    try {
      const logistiqueService = new ServiceLogistique();
      await logistiqueService.commander(pieceId, quantite);
      await LogistiqueController.refreshTable();
    } catch (e) {
      alert("Erreur lors de la commande : " + e.message);
    }
  }

  /**
   * Modifie la quantité d'une pièce en stock.
   * Valide que la quantité est positive avant de modifier le stock.
   * @static
   * @async
   * @param {number} pieceId - ID de la pièce
   * @param {number} quantite - Nouvelle quantité
   * @returns {Promise<void>}
   */  static async modifier(pieceId, quantite) {
    if (quantite < 0) {
      alert("Veuillez entrer une quantité valide.");
      return;
    }
    try {
      const logistiqueService = new ServiceLogistique();
      await logistiqueService.modifier(pieceId, quantite);
      await LogistiqueController.refreshTable();
    } catch (e) {
      alert("Erreur lors de la modification : " + e.message);
    }
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  LogistiqueController.init();
});

