import { Request, Response, NextFunction } from "express";
export declare function isLoggedIn(req: Request, res: Response, next: NextFunction): void;
export declare function isNotLoggedIn(req: Request, res: Response, next: NextFunction): void;
