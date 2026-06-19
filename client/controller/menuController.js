/**
 * @fileoverview Contrôleur pour le menu responsive - gestion de l'ouverture/fermeture du menu latéral
 * @author Arnaud Ramirez
 * @date 11.06.2025
 * @version 1.0.0
 */

/**
 * Contrôleur pour la gestion du menu responsive.
 * @class
 */
class MenuController {
  /**
   * Initialise le contrôleur de menu et configure les événements de clic.
   * Gère l'affichage et le masquage du menu de navigation lors du clic sur le bouton.
   * @static
   */
  static init() {
    const bouton = document.getElementById('btnMenu');
    const nav = document.getElementById('nav');
    
    if (bouton) {
      bouton.onclick = function(e) {
        if (nav.style.display === "none" || nav.style.display === "") {
          nav.style.display = "flex";
        } else {
          nav.style.display = "none";
        }
      };
    }
  }
}

// Initialiser
window.onload = function() {
  MenuController.init();
};