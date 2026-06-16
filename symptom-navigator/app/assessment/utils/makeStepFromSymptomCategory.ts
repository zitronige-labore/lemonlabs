import { getSymptomCategoryList } from "../medicalLogic/symptomCategoryList";


// getting list but removing types so there is no circular import
const categoryList = getSymptomCategoryList("") as unknown as readonly {
  readonly step: string;
  readonly categories: readonly { readonly category: string; readonly step: string }[];
}[];

export type categoryTargetSteps = typeof categoryList[number]["categories"][number]["step"];