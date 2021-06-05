//  Initial State
export interface Marks {
  starterMark: string;
  nextMark: string;
}

//  Reducer Action
export interface MarkAction {
  type: string;
  payload: string;
}
