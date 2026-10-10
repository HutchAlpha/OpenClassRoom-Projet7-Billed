/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"

describe("vérification des pages d'erreur", () => {
    test("Vérification de la page d'erreur 404", () => {
        const html = ROUTES({ pathname: ROUTES_PATH.Erreur404 })

        document.body.innerHTML = html

        expect(screen.getByText("Erreur 404")).toBeTruthy()
    })

    test("Vérification de la page d'erreur 500", () => {
        const html = ROUTES({ pathname: ROUTES_PATH.Erreur500 })

        document.body.innerHTML = html

        expect(screen.getByText("Erreur 500")).toBeTruthy()
    })
})
