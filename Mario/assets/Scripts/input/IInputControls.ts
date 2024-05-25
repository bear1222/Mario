/**
 * The state of a button-like variable during a single frame.
 */
export enum ButtonState{
    /** The button is in its natural (inactive) state. */
    Rest,
    /** The button is pressed down this frame. */
    Pressed,
    /** The button is held down. */
    Held,
    /** The button is released this frame. */
    Released,
}
export type Axis1D = number;
/**
 * Interface for objects that can support control inputs.
 * You can consider this as an abstraction over different kinds of inputs.
 */
export interface IInputControls {
    readonly horizontalAxis: Axis1D;
    readonly verticalAxis: Axis1D;
    readonly attack: ButtonState;
    readonly interact: ButtonState;
    readonly jumpPressed: boolean;
    readonly downPressed: boolean;
    readonly enterPressed: boolean;
}

export function hasImplementedInputControls(obj: any): obj is IInputControls{
    return obj && 
    (obj.horizontalAxis !== undefined) &&
    (obj.verticalAxis !== undefined) &&
    (obj.attack !== undefined) &&
    (obj.interact !== undefined) &&
    (obj.jumpPressed !== undefined) &&
    (obj.downPressed !== undefined) &&
    (obj.enterPressed !== undefined) 
}