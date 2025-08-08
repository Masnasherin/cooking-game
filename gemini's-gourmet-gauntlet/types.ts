
export enum GameState {
  LOADING,
  READY_TO_PLAY,
  CHECKING,
  SUCCESS,
  ERROR,
}

export interface RecipeData {
  dishName: string;
  ingredients: string[];
  instructions: string[];
  distractors: string[];
}
