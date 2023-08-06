import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  // For more information on using properties and state in lit
  // check out this link https://lit.dev/docs/components/properties/
  @property() message = 'Welcome!';

  static get styles() {
    return [
      styles,
      css`
      #welcomeBar {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      #welcomeCard,
      #infoCard {
        padding: 18px;
        padding-top: 0px;
      }

      sl-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin:10px;
      }

      .flex {
        display:flex;
        flex-direction: row;
        justify-content: space-around;
      }

      sl-card img {
        width: 150px;
        padding-bottom: 25px;
      }
      sl-card img.small {
        width: 75px;
        padding-bottom: 25px;
      }
      sl-card sl-button {
        text-decoration: none;
        display:block;
      }

      @media(min-width: 750px) {
        sl-card {
          width: 70vw;
        }
      }

      a{
        text-decoration: none;
      }


      @media (horizontal-viewport-segments: 2) {
        #welcomeBar {
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
        }

        #welcomeCard {
          margin-right: 64px;
        }
      }
    `];
  }

  constructor() {
    super();
  }

  share() {
    if ((navigator as any).share) {
      (navigator as any).share({
        title: 'NOWA KRZYŻÓWKA',
      });
    }
  }

  render() {
    return html`
      <app-header></app-header>

      <main>
        <div id="welcomeBar">

          <sl-card>
            <div class ="flex">
              <img class="small" src="assets/icons/small.png" />
            </div>
            <diV class ="flex">
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-s-1">ŁATWA</sl-button>
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-s-3">ŚREDNIA</sl-button>
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-s-5">TRUDNA</sl-button>
            </div>
          </sl-card>


          <sl-card>
            <diV class ="flex">
              <img src="assets/icons/medium.png" />
            </div>
            <diV class ="flex">
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-m-1">ŁATWA</sl-button>
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-m-3">ŚREDNIA</sl-button>
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-m-5">TRUDNA</sl-button>
            </div>
          </sl-card>

          <sl-card>
            <diV class ="flex">
              <img src="assets/icons/big.png" />
            </div>
            <diV class ="flex">
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-l-1">ŁATWA</sl-button>
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-l-3">ŚREDNIA</sl-button>
              <sl-button variant="primary" href="${(import.meta as any).env.BASE_URL}cross-l-5">TRUDNA</sl-button>
            </div>
          </sl-card>


<!--
          <br>
          <br>
          <sl-button href="${(import.meta as any).env.BASE_URL}editor" variant="primary">Edytor</sl-button> -->
        </div>
      </main>
    `;
  }
}
