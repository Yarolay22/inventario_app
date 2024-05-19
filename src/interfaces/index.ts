import { Router } from "express";

export interface UserRequest {
    firstName: string;
    lastName: string;
    phone?: string;
    userName: string;
    email: string;
    password: string;
}


export interface Auth {
    email: string;
    password: string;
}



export interface AppRoute {
    pathRoute: () => string;
    router: () => Router
}