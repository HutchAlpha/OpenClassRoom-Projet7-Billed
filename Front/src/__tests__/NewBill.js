/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../pages/NewBill/NewBillUI.js"
import { initNewBillPage, handleChangeFile, handleSubmit, resetBillFileState } from "../pages/NewBill/NewBill.js"
import { ROUTES_PATH } from "../constants/routes.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the form should be rendered with all required fields", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
      expect(screen.getByTestId("expense-type")).toBeTruthy()
      expect(screen.getByTestId("expense-name")).toBeTruthy()
      expect(screen.getByTestId("datepicker")).toBeTruthy()
      expect(screen.getByTestId("amount")).toBeTruthy()
      expect(screen.getByTestId("vat")).toBeTruthy()
      expect(screen.getByTestId("pct")).toBeTruthy()
      expect(screen.getByTestId("commentary")).toBeTruthy()
      expect(screen.getByTestId("file")).toBeTruthy()
    })

    test("Then the submit button should be rendered", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const submitButton = screen.getByText("Envoyer")

      expect(submitButton).toBeTruthy()
      expect(submitButton.type).toBe("submit")
    })

    test("Then the page title should be displayed", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
    })

    test("Then the expense type select should have all options", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const expenseTypeSelect = screen.getByTestId("expense-type")

      expect(expenseTypeSelect).toBeTruthy()
      expect(screen.getByText("Transports")).toBeTruthy()
      expect(screen.getByText("Restaurants et bars")).toBeTruthy()
      expect(screen.getByText("Hôtel et logement")).toBeTruthy()
      expect(screen.getByText("Services en ligne")).toBeTruthy()
      expect(screen.getByText("IT et électronique")).toBeTruthy()
      expect(screen.getByText("Equipement et matériel")).toBeTruthy()
      expect(screen.getByText("Fournitures de bureau")).toBeTruthy()
    })
  })

  describe("Lorsque la fonction initNewBillPage est appelée", () => {
    test("Alors la page doit être correctement initialisée", () => {
      document.body.innerHTML = NewBillUI()

      const onNavigate = jest.fn()

      const store = {
        bills: jest.fn()
      }

      const localStorage = {
        getItem: jest.fn()
      }

      expect(() => {
        initNewBillPage({document,onNavigate,store,localStorage})
      }).not.toThrow()

      const formulaireNouvelleNote = document.querySelector(
        'form[data-testid="form-new-bill"]'
      )

      const champFichier = document.querySelector(
        'input[data-testid="file"]'
      )

      expect(formulaireNouvelleNote).toBeTruthy()
      expect(champFichier).toBeTruthy()
    })
  })


describe("Lorsque handleChangeFile est appelée", () => {
  beforeEach(() => {
    resetBillFileState()
    document.body.innerHTML = NewBillUI()
  })

  test("Alors un fichier image valide est uploadé dans le store",async () => {
      const fileInput = document.querySelector(
        `input[data-testid="file"]`
      )

      const mockFile = new File(
        ["image"],
        "test-image.jpg",
        { type: "image/jpeg" }
      )

      Object.defineProperty(fileInput, "files", {
        value: [mockFile],
        configurable: true
      })

      const localStorage = {
        getItem: jest.fn(() =>
          JSON.stringify({ email: "test@mock.com" })
        )
      }

      const create = jest.fn(() =>
        Promise.resolve({
          fileUrl: "https://example.com/test-image.jpg",
          key: "12345"
        })
      )

      const store = {
        bills: jest.fn(() => ({
          create
        }))
      }

      const e = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\fakepath\\test-image.jpg"
        }
      }

      expect(fileInput.files[0].name).toBe("test-image.jpg")
      expect(fileInput.files[0].type).toBe("image/jpeg")
      expect(fileInput.files[0]).toBeInstanceOf(File)

      await handleChangeFile(e, { store, localStorage })

      expect(e.preventDefault).toHaveBeenCalled()
      expect(localStorage.getItem).toHaveBeenCalledWith("user")
      expect(store.bills).toHaveBeenCalledTimes(1)
      expect(create).toHaveBeenCalledTimes(1)

      expect(create).toHaveBeenCalledWith({
        data: expect.any(FormData),
        headers: {
          noContentType: true
        }
      })
    }
  )

  test("Alors un fichier non image est refusé et n'est pas uploadé",() => {
      const fileInput = document.querySelector(
        `input[data-testid="file"]`
      )

      const mockFile = new File(
        ["document"],
        "test-document.pdf",
        { type: "application/pdf" }
      )

      Object.defineProperty(fileInput, "files", {
        value: [mockFile],
        configurable: true
      })

      const localStorage = {
        getItem: jest.fn(() =>
          JSON.stringify({ email: "test@mock.com" })
        )
      }

      const create = jest.fn()

      const store = {
        bills: jest.fn(() => ({
          create
        }))
      }

      const alertSpy = jest
        .spyOn(window, "alert")
        .mockImplementation(() => {})

      const e = {
        preventDefault: jest.fn(),
        target: {
          value: "C:\\fakepath\\test-document.pdf"
        }
      }

      expect(fileInput.files[0].name).toBe("test-document.pdf")
      expect(fileInput.files[0].type).toBe("application/pdf")
      expect(fileInput.files[0]).toBeInstanceOf(File)

      handleChangeFile(e, { store, localStorage })

      expect(e.preventDefault).toHaveBeenCalled()
      expect(alertSpy).toHaveBeenCalledWith(
        "Veuillez sélectionner un fichier au format JPG, JPEG ou PNG."
      )
      expect(create).not.toHaveBeenCalled()

      alertSpy.mockRestore()
    }
  )


  test("Alors une erreur d'upload est interceptée sans faire planter la page", async () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation(() => {})

      const fileInput = document.querySelector('input[data-testid="file"]')
      const file = new File(["image"], "facture.png", { type: "image/png" })
      Object.defineProperty(fileInput, "files", {
        value: [file],
        configurable: true
      })

      const create = jest.fn(() => Promise.reject(new Error("upload error")))
      const store = { bills: jest.fn(() => ({ create })) }
      const localStorage = {
        getItem: jest.fn(() => JSON.stringify({ email: "test@mock.com" }))
      }
      const e = {
        preventDefault: jest.fn(),
        target: { value: "C:\\fakepath\\facture.png" }
      }

      handleChangeFile(e, { store, localStorage })
      await new Promise((resolve) => setTimeout(resolve, 0))

      expect(create).toHaveBeenCalledTimes(1)
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    }
  )

  
describe("Lorsque handleSubmit est appelée", () => {
  let form

  const remplirFormulaire = ({name,amount,commentary}) => {
      form.querySelector(
        'input[data-testid="expense-name"]'
      ).value = name

      form.querySelector(
        'input[data-testid="amount"]'
      ).value = amount

      form.querySelector(
        'textarea[data-testid="commentary"]'
      ).value = commentary
    }

  const buildDeps = () => {
    const update = jest.fn(() =>
      Promise.resolve()
    )

    const store = {
      bills: jest.fn(() => ({
        update
      }))
    }

    const onNavigate = jest.fn()

    const localStorage = {
      getItem: jest.fn(() =>
        JSON.stringify({ email: "test@mock.com" })
      )
    }

    return {update,store,onNavigate,localStorage}
  }

  beforeEach(() => {
    resetBillFileState()
    document.body.innerHTML = NewBillUI()

    form = document.querySelector(
      'form[data-testid="form-new-bill"]'
    )
  })

  test("Alors la note de frais est envoyée et on navigue vers Bills",async () => {
      remplirFormulaire({
        name: "Vol Paris Londres",
        amount: "348",
        commentary: "Un commentaire valide"
      })

      const {update,store,onNavigate,localStorage} = buildDeps()

      const e = {
        preventDefault: jest.fn(),
        target: form
      }

      handleSubmit(e, {onNavigate,store,localStorage})

      await Promise.resolve()

      expect(e.preventDefault).toHaveBeenCalled()
      expect(update).toHaveBeenCalledTimes(1)
      expect(onNavigate).toHaveBeenCalledWith(
        ROUTES_PATH["Bills"]
      )
    }
  )
})


  describe("Test de validation des champs du formulaire", () => {
  let form

  const remplirFormulaire = ({ name, amount, commentary }) => {
    form.querySelector(
      'input[data-testid="expense-name"]'
    ).value = name

    form.querySelector(
      'input[data-testid="amount"]'
    ).value = amount

    form.querySelector(
      'textarea[data-testid="commentary"]'
    ).value = commentary
  }

  const buildDeps = () => {
    const update = jest.fn(() => Promise.resolve())

    const store = {
      bills: jest.fn(() => ({
        update
      }))
    }

    const onNavigate = jest.fn()

    const localStorage = {
      getItem: jest.fn(() =>
        JSON.stringify({ email: "test@mock.com" })
      )
    }

    return {
      update,
      store,
      onNavigate,
      localStorage
    }
  }

  beforeEach(() => {
    resetBillFileState()
    document.body.innerHTML = NewBillUI()

    form = document.querySelector(
      'form[data-testid="form-new-bill"]'
    )
  })

    test("Alors un nom de dépense vide déclenche une alerte", () => {
      const {onNavigate,store,localStorage} = buildDeps()

      const e = {
        preventDefault: jest.fn(),
        target: form
      }

      remplirFormulaire({
        name: "",
        amount: "100",
        commentary: "Un commentaire valide"
      })

      window.alert = jest.fn()

      handleSubmit(e, {onNavigate,store,localStorage})

      expect(window.alert).toHaveBeenCalledWith(
        "Veuillez saisir un nom de dépense"
      )
    })

    test("Alors un montant négatif déclenche une alerte", () => {
      const {onNavigate,store,localStorage} = buildDeps()

      const e = {
        preventDefault: jest.fn(),
        target: form
      }

      remplirFormulaire({
        name: "Vol Paris Londres",
        amount: "-50",
        commentary: "Un commentaire valide"
      })

      window.alert = jest.fn()

      handleSubmit(e, {onNavigate,store,localStorage})

      expect(window.alert).toHaveBeenCalledWith(
        "Veuillez saisir un montant positif"
      )
    })

    test("Alors un commentaire trop court déclenche une alerte", () => {
      const {onNavigate,store,localStorage} = buildDeps()

      const e = {
        preventDefault: jest.fn(),
        target: form
      }

      remplirFormulaire({
        name: "Vol Paris Londres",
        amount: "100",
        commentary: "abc"
      })

      window.alert = jest.fn()

      handleSubmit(e, {onNavigate,store,localStorage})

      expect(window.alert).toHaveBeenCalledWith(
        "Veuillez saisir un commentaire d'au moins 5 caractères"
      )
    })
  })
})
})