import { Router } from "express";

export interface CustomRoute {
    path: string,
    router: Router,
}