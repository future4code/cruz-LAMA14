import { BandBusiness } from "../src/business/BandBusiness"
import { BaseError } from "../src/error/BaseError"
import { Band, BandInputDTO } from "../src/model/Band"
import { UserRole } from "../src/model/User"

const bandDatabase = {
  createBand: jest.fn(async(band: Band) => {}),
  getBandByIdOrName: jest.fn((input: string) => {
    if(input === 'validId' || input === 'validName') {
      return {
        id: "bandId", 
        name: "BandName", 
        music_genre: "genre",
        responsible: "Responsible"
      }
    } else {
      throw new BaseError("Unable to find a band", 404)
    }
  })

}

const authenticator = {
  generateToken: jest.fn((payload: {id:string, role: UserRole}) => {
    getData: jest.fn((token:string) => {
      switch(token) {
        case "userToken":
          return {id:"token_id", role: "NORMAL"}
        case "adminToken":
          return {id:"token_id", role: "ADMIN"}
        default:
          return undefined
      }
    })
  })
}

const idGenerator = {
  generate: jest.fn(() => "bandId")
}

const bandBusiness = new BandBusiness(
  bandDatabase as any,
  idGenerator as any,
  authenticator as any
)

describe("Testing register band", () => {
  test("Should return error if no name", async () => {
    expect.assertions(2)

    const token = "adminToken"
    const band = {
      music_genre: "genre",
      responsible: "responsible"
    } as BandInputDTO

    try {

      await bandBusiness.createBand(band, token)
      
    } catch (error) {
      expect(error.message).toBe("You must inform 'name', 'music_genre', and 'responsible'")
      expect(error.code).toBe(406)
    }
  })

  test("Should return error if no responsible", async () => {
    expect.assertions(2)

    const token = "adminToken"
    const band = {
      music_genre: "genre",
      name: "bandName"
    } as BandInputDTO

    try {

      await bandBusiness.createBand(band, token)
      
    } catch (error) {
      expect(error.message).toBe("You must inform 'name', 'music_genre', and 'responsible'")
      expect(error.code).toBe(406)
    }
  })

  test("Should return error if no music genre", async () => {
    expect.assertions(2)

    const token = "adminToken"
    const band = {
      name: "bandName",
      responsible: "responsible"
    } as BandInputDTO

    try {

      await bandBusiness.createBand(band, token)
      
    } catch (error) {
      expect(error.message).toBe("You must inform 'name', 'music_genre', and 'responsible'")
      expect(error.code).toBe(406)
    }
  })

  test("Should return error if no user ADMIN", async () => {
    expect.assertions(2)

    const token = "adminToken"
    const band = {
      name: "bandName",
      music_genre: "genre",
      responsible: "responsible"
    } as BandInputDTO

    try {

      await bandBusiness.createBand(band, token)
      
    } catch (error) {
      expect(error.message).toBe("Only Admin users can create bands")
      expect(error.code).toBe(406)
    }
  })

  test("Should register a band", async () => {
    expect.assertions(1)

    const token = "adminToken"
    const band = {
      name: "bandName",
      music_genre: "genre",
      responsible: "responsible"
    } as BandInputDTO

      await bandBusiness.createBand(band, token)

      expect(bandDatabase.createBand).toHaveBeenCalledWith({
        id: "bandId", 
        name: "bandName",
        music_genre: "genre",
        responsible: "responsible"
      })
  })
})

describe("Get band by ID", () => {
  test("Should return error if no input", async () => {
    expect.assertions(2)

    const input = ""

    try {

      await bandBusiness.getBandByIdOrName(input)
      
    } catch (error) {
      expect(error.message).toBe("Invalid input, try again")
      expect(error.code).toBe(400)
    }
  })

  test("Should return a band by valid ID", async () => {
    expect.assertions(1)

    const input = "bandId"

    try {

      const result = await bandBusiness.getBandByIdOrName(input)
      expect(result.getId()).toBe("bandId")
      expect(result.getName()).toBe("BandName")
      expect(result.getMusicGenre()).toBe("genre")
      expect(result.getResponsible()).toBe("Responsible")
      
    } catch (error) {
      expect(error.message).toBe("Invalid input, try again")
      expect(error.code).toBe(400)
    }
  })
})