import { getSymptomCategoryList } from "../medicalLogic/symptomCategoryList";


// list for category pages
const categoryList = getSymptomCategoryList("");

export type categoryTargetSteps = typeof categoryList[number]["categories"][number]["step"];