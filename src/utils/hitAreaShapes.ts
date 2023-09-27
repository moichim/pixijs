import * as PIXI from 'pixi.js';

/**
 * Shapes From PhysicsEditor Exporter : Phaser(P2)
 *
 * @class
 * @Inspired https://github.com/eXponenta/pixi-poly
 * @Editor https://www.codeandweb.com/physicseditor
 */
export default class HitAreaShapes {

    shapes: any;

  constructor(shapes = {} as any) {
    const keys = Object.keys(shapes)[0];

    this.shapes = shapes[keys].map(({ shape }) => new PIXI.Polygon(shape));
  }

  /**
   * Called by hitArea
   * @param {number} x
   * @param {number} y
   */
  contains(x = 0, y = 0) {
    return (!this.shapes || this.shapes.length === 0)
      ? false
      : this.shapes.some((shape: { contains: (arg0: number, arg1: number) => any; }) => shape.contains(x, y));
  }
}