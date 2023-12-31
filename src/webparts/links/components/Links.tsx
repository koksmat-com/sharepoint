import * as React from 'react';
import styles from './Links.module.scss';
import { ILinksProps } from './ILinksProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useState } from 'react';
// https://base64.guru/converter/encode/image/svg

interface IIconLink {

  url: string;
  icon: string
}
interface ILinkItem {
  title: string;
  iconLinks: IIconLink[]
}
const svgFigmaMobile = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI5LjgwMDYgMzguNzE5SDE4LjE5OTRDMTYuNDgwMiAzOC43MTkgMTUuMDgxNiAzNy4zMjA0IDE1LjA4MTYgMzUuNjAxMlYxMi4zOTg4QzE1LjA4MTYgMTAuNjc5NiAxNi40ODAyIDkuMjgwOTggMTguMTk5NCA5LjI4MDk4SDI5LjgwMDZDMzEuNTE5OCA5LjI4MDk4IDMyLjkxODQgMTAuNjc5NiAzMi45MTg0IDEyLjM5ODhWMTMuNTU4OUMzMi45MTg0IDEzLjk5OTQgMzIuNTYxMyAxNC4zNTY1IDMyLjEyMDkgMTQuMzU2NUMzMS42ODA0IDE0LjM1NjUgMzEuMzIzMyAxMy45OTk0IDMxLjMyMzMgMTMuNTU4OVYxMi4zOTg4QzMxLjMyMzMgMTEuNTU5MiAzMC42NDAyIDEwLjg3NjEgMjkuODAwNiAxMC44NzYxSDE4LjE5OTRDMTcuMzU5OCAxMC44NzYxIDE2LjY3NjcgMTEuNTU5MiAxNi42NzY3IDEyLjM5ODhWMzUuNjAxMkMxNi42NzY3IDM2LjQ0MDggMTcuMzU5OCAzNy4xMjM5IDE4LjE5OTQgMzcuMTIzOUgyOS44MDA2QzMwLjY0MDIgMzcuMTIzOSAzMS4zMjMzIDM2LjQ0MDggMzEuMzIzMyAzNS42MDEyVjE5LjM1OTVDMzEuMzIzMyAxOC45MTkgMzEuNjgwNCAxOC41NjE5IDMyLjEyMDkgMTguNTYxOUMzMi41NjEzIDE4LjU2MTkgMzIuOTE4NCAxOC45MTkgMzIuOTE4NCAxOS4zNTk1VjM1LjYwMTJDMzIuOTE4NCAzNy4zMjA0IDMxLjUxOTggMzguNzE5IDI5LjgwMDYgMzguNzE5WiIgZmlsbD0iIzJEMzJBQSIvPgo8cGF0aCBkPSJNMjAuNTE5NiAxNC4zMzkxQzIwLjMwOTcgMTQuMzM5MSAyMC4xMDQgMTQuMjU0MSAxOS45NTU1IDE0LjEwNTZDMTkuODA3MyAxMy45NTcxIDE5LjcyMjEgMTMuNzUxNSAxOS43MjIxIDEzLjU0MTVDMTkuNzIyMSAxMy4zMzE1IDE5LjgwNzMgMTMuMTI2MiAxOS45NTU1IDEyLjk3NzdDMjAuMTA0IDEyLjgyOTIgMjAuMzA5NyAxMi43NDM5IDIwLjUxOTYgMTIuNzQzOUMyMC43Mjk2IDEyLjc0MzkgMjAuOTM1MyAxMi44MjkyIDIxLjA4MzcgMTIuOTc3N0MyMS4yMzIgMTMuMTI2MiAyMS4zMTcyIDEzLjMzMTUgMjEuMzE3MiAxMy41NDE1QzIxLjMxNzIgMTMuNzUxNSAyMS4yMzIgMTMuOTU3MSAyMS4wODM3IDE0LjEwNTZDMjAuOTM1MyAxNC4yNTQxIDIwLjcyOTYgMTQuMzM5MSAyMC41MTk2IDE0LjMzOTFaIiBmaWxsPSIjMkQzMkFBIi8+CjxwYXRoIGQ9Ik0yNS4xNjAxIDM1LjIzODdIMjIuODM5OUMyMi4zOTk0IDM1LjIzODcgMjIuMDQyMyAzNC44ODE2IDIyLjA0MjMgMzQuNDQxMUMyMi4wNDIzIDM0LjAwMDYgMjIuMzk5NCAzMy42NDM1IDIyLjgzOTkgMzMuNjQzNUgyNS4xNjAxQzI1LjYwMDYgMzMuNjQzNSAyNS45NTc3IDM0LjAwMDYgMjUuOTU3NyAzNC40NDExQzI1Ljk1NzcgMzQuODgxNiAyNS42MDA2IDM1LjIzODcgMjUuMTYwMSAzNS4yMzg3WiIgZmlsbD0iIzJEMzJBQSIvPgo8cGF0aCBkPSJNMjcuNDgwNSAxNC4zNTY1SDI0QzIzLjU1OTUgMTQuMzU2NSAyMy4yMDI0IDEzLjk5OTQgMjMuMjAyNCAxMy41NTg5QzIzLjIwMjQgMTMuMTE4NCAyMy41NTk1IDEyLjc2MTQgMjQgMTIuNzYxNEgyNy40ODA1QzI3LjkyMSAxMi43NjE0IDI4LjI3ODEgMTMuMTE4NCAyOC4yNzgxIDEzLjU1ODlDMjguMjc4MSAxMy45OTk0IDI3LjkyMSAxNC4zNTY1IDI3LjQ4MDUgMTQuMzU2NVoiIGZpbGw9IiMyRDMyQUEiLz4KPC9zdmc+Cg==`
const svgFigmaDesktop = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM2Ljc2MTMgMTAuNDQxMUgxMS4yMzg3QzEwLjE1OTIgMTAuNDQxMSA5LjI4MDk2IDExLjMxOTMgOS4yODA5NiAxMi4zOTg4VjMyLjEwMTlDOS4yODA5NiAzMy4xODE0IDEwLjE1OTIgMzQuMDU5NyAxMS4yMzg3IDM0LjA1OTdIMjMuMjAyNFYzNS45NjM4SDE5LjM1OTVDMTguOTE5IDM1Ljk2MzggMTguNTYxOSAzNi4zMjA4IDE4LjU2MTkgMzYuNzYxM0MxOC41NjE5IDM3LjIwMTggMTguOTE5IDM3LjU1ODkgMTkuMzU5NSAzNy41NTg5SDI4LjY0MDVDMjkuMDgxIDM3LjU1ODkgMjkuNDM4MSAzNy4yMDE4IDI5LjQzODEgMzYuNzYxM0MyOS40MzgxIDM2LjMyMDggMjkuMDgxIDM1Ljk2MzggMjguNjQwNSAzNS45NjM4SDI0Ljc5NzZWMzQuMDU5N0gyOC42NDA1QzI5LjA4MSAzNC4wNTk3IDI5LjQzODEgMzMuNzAyNiAyOS40MzgxIDMzLjI2MjFDMjkuNDM4MSAzMi44MjE2IDI5LjA4MSAzMi40NjQ1IDI4LjY0MDUgMzIuNDY0NUgxMS4yMzg3QzExLjAzODcgMzIuNDY0NSAxMC44NzYxIDMyLjMwMTkgMTAuODc2MSAzMi4xMDE5VjEyLjM5ODhDMTAuODc2MSAxMi4xOTg5IDExLjAzODcgMTIuMDM2MyAxMS4yMzg3IDEyLjAzNjNIMzYuNzYxM0MzNi45NjEyIDEyLjAzNjMgMzcuMTIzOSAxMi4xOTg5IDM3LjEyMzkgMTIuMzk4OFYzMi4xMDE5QzM3LjEyMzkgMzIuMzAxOSAzNi45NjEyIDMyLjQ2NDUgMzYuNzYxMyAzMi40NjQ1SDM0LjQ0MTFDMzQuMDAwNiAzMi40NjQ1IDMzLjY0MzUgMzIuODIxNiAzMy42NDM1IDMzLjI2MjFDMzMuNjQzNSAzMy43MDI2IDM0LjAwMDYgMzQuMDU5NyAzNC40NDExIDM0LjA1OTdIMzYuNzYxM0MzNy44NDA4IDM0LjA1OTcgMzguNzE5IDMzLjE4MTQgMzguNzE5IDMyLjEwMTlWMTIuMzk4OEMzOC43MTkgMTEuMzE5MyAzNy44NDA4IDEwLjQ0MTEgMzYuNzYxMyAxMC40NDExWiIgZmlsbD0iIzJEMzJBQSIvPgo8cGF0aCBkPSJNMjIuODM5OSAxNS41MTY2SDI1LjE2MDFDMjUuNjAwNiAxNS41MTY2IDI1Ljk1NzcgMTUuMTU5NSAyNS45NTc3IDE0LjcxOUMyNS45NTc3IDE0LjI3ODUgMjUuNjAwNiAxMy45MjE0IDI1LjE2MDEgMTMuOTIxNEgyMi44Mzk5QzIyLjM5OTQgMTMuOTIxNCAyMi4wNDIzIDE0LjI3ODUgMjIuMDQyMyAxNC43MTlDMjIuMDQyMyAxNS4xNTk1IDIyLjM5OTQgMTUuNTE2NiAyMi44Mzk5IDE1LjUxNjZaIiBmaWxsPSIjMkQzMkFBIi8+CjxwYXRoIGQ9Ik0zMi4zNDUxIDI2LjA3N0wyOS40NjQ1IDIzLjE5NjRMMzEuNTI4NSAyMS42MTRDMzEuNzc2OSAyMS40MjM1IDMxLjg5MSAyMS4xMDU0IDMxLjgyMDEgMjAuODAwNUMzMS43NDkzIDIwLjQ5NTYgMzEuNTA2NiAyMC4yNjAzIDMxLjE5OTcgMjAuMTk4OUwyMi45OTYzIDE4LjU1ODNDMjIuNzM0OCAxOC41MDU4IDIyLjQ2NDQgMTguNTg3OCAyMi4yNzU5IDE4Ljc3NjRDMjIuMDg3MyAxOC45NjUgMjIuMDA1NCAxOS4yMzUzIDIyLjA1NzcgMTkuNDk2OEwyMy42OTg0IDI3LjcwMDFDMjMuNjk4NyAyNy43MDE5IDIzLjY5OTMgMjcuNzAzNSAyMy42OTk2IDI3LjcwNTJDMjMuNzAzOSAyNy43MjYgMjMuNzA4OSAyNy43NDY2IDIzLjcxNDkgMjcuNzY3QzIzLjcxNTYgMjcuNzY5NiAyMy43MTY1IDI3Ljc3MjEgMjMuNzE3MiAyNy43NzQ3QzIzLjcyMzQgMjcuNzk1MSAyMy43MzAyIDI3LjgxNTQgMjMuNzM4IDI3LjgzNTNDMjMuNzM4NiAyNy44MzY5IDIzLjczOTMgMjcuODM4MyAyMy43NCAyNy44Mzk5QzIzLjc0NzUgMjcuODU5IDIzLjc1NTkgMjcuODc3OCAyMy43NjUgMjcuODk2M0MyMy43NjU5IDI3Ljg5ODEgMjMuNzY2NyAyNy44OTk4IDIzLjc2NzUgMjcuOTAxNkMyMy43NzY2IDI3LjkxOTggMjMuNzg2NiAyNy45Mzc2IDIzLjc5NzIgMjcuOTU1MUMyMy43OTg5IDI3Ljk1OCAyMy44MDA2IDI3Ljk2MDggMjMuODAyMyAyNy45NjM3QzIzLjgxMjggMjcuOTgwNSAyMy44MjM5IDI3Ljk5NyAyMy44MzU3IDI4LjAxMzJDMjMuODM3NyAyOC4wMTU5IDIzLjgzOTcgMjguMDE4NiAyMy44NDE3IDI4LjAyMTJDMjMuODUzOCAyOC4wMzc0IDIzLjg2NjQgMjguMDUzMyAyMy44Nzk5IDI4LjA2ODdDMjMuODgxIDI4LjA2OTkgMjMuODgyMSAyOC4wNzEgMjMuODgzMSAyOC4wNzIyQzIzLjg5NiAyOC4wODY3IDIzLjkwOTUgMjguMTAwOCAyMy45MjM2IDI4LjExNDVDMjMuOTI1NSAyOC4xMTY0IDIzLjkyNzQgMjguMTE4MyAyMy45MjkzIDI4LjEyMDJDMjMuOTQzNCAyOC4xMzM2IDIzLjk1ODEgMjguMTQ2NSAyMy45NzMzIDI4LjE1OUMyMy45NzY2IDI4LjE2MTcgMjMuOTc5OCAyOC4xNjQzIDIzLjk4MzEgMjguMTY2OUMyMy45ODcxIDI4LjE3MDEgMjMuOTkxIDI4LjE3MzUgMjMuOTk1MiAyOC4xNzY3QzI0LjAwMTMgMjguMTgxNCAyNC4wMDc3IDI4LjE4NTQgMjQuMDEzOSAyOC4xODk5QzI0LjAyMjggMjguMTk2MiAyNC4wMzE2IDI4LjIwMjYgMjQuMDQwNyAyOC4yMDg2QzI0LjA1MTIgMjguMjE1NiAyNC4wNjE4IDI4LjIyMiAyNC4wNzI0IDI4LjIyODNDMjQuMDgwNiAyOC4yMzMyIDI0LjA4ODcgMjguMjM4MSAyNC4wOTcgMjguMjQyN0MyNC4xMDg5IDI4LjI0OTMgMjQuMTIxMSAyOC4yNTUzIDI0LjEzMzIgMjguMjYxMkMyNC4xNDA4IDI4LjI2NDkgMjQuMTQ4NCAyOC4yNjg3IDI0LjE1NjEgMjguMjcyMUMyNC4xNjkgMjguMjc3OCAyNC4xODIgMjguMjgzIDI0LjE5NTEgMjguMjg4QzI0LjIwMjcgMjguMjkxIDI0LjIxMDMgMjguMjk0IDI0LjIxOCAyOC4yOTY3QzI0LjIzMSAyOC4zMDEzIDI0LjI0NDIgMjguMzA1MiAyNC4yNTczIDI4LjMwOUMyNC4yNjU3IDI4LjMxMTQgMjQuMjczOSAyOC4zMTQgMjQuMjgyMyAyOC4zMTYyQzI0LjI5NDggMjguMzE5NCAyNC4zMDc0IDI4LjMyMiAyNC4zMiAyOC4zMjQ1QzI0LjMyOTQgMjguMzI2NSAyNC4zMzg2IDI4LjMyODYgMjQuMzQ4IDI4LjMzMDJDMjQuMzYgMjguMzMyMiAyNC4zNzIxIDI4LjMzMzUgMjQuMzg0MSAyOC4zMzQ5QzI0LjM5NDIgMjguMzM2MiAyNC40MDQyIDI4LjMzNzggMjQuNDE0NCAyOC4zMzg2QzI0LjQyODEgMjguMzM5NyAyNC40NDIgMjguMzQgMjQuNDU1OCAyOC4zNDA0QzI0LjQ2MzggMjguMzQwNiAyNC40NzE3IDI4LjM0MTQgMjQuNDc5NyAyOC4zNDE0QzI0LjQ5NDIgMjguMzQxNCAyNC41MDg3IDI4LjM0MDkgMjQuNTIzMyAyOC4zNDAxQzI0LjUyNiAyOC4zNCAyNC41Mjg2IDI4LjMzOTcgMjQuNTMxMyAyOC4zMzk1QzI0LjU0MjQgMjguMzM4OCAyNC41NTM3IDI4LjMzNzkgMjQuNTY0OSAyOC4zMzY3QzI0LjU3IDI4LjMzNjEgMjQuNTc1IDI4LjMzNTUgMjQuNTggMjguMzM0OEMyNC41ODg3IDI4LjMzMzcgMjQuNTk3NCAyOC4zMzI2IDI0LjYwNjEgMjguMzMxMkMyNC42MTI0IDI4LjMzMDEgMjQuNjE4NiAyOC4zMjkgMjQuNjI0OCAyOC4zMjc5QzI0LjYyODggMjguMzI3MiAyNC42MzI5IDI4LjMyNjYgMjQuNjM2OSAyOC4zMjU4QzI0LjY0MDQgMjguMzI1MSAyNC42NDM3IDI4LjMyNDIgMjQuNjQ3MiAyOC4zMjM1QzI0LjY1NCAyOC4zMjIgMjQuNjYwOSAyOC4zMjA1IDI0LjY2NzcgMjguMzE4OEMyNC42NzQ5IDI4LjMxNzEgMjQuNjgyMSAyOC4zMTUyIDI0LjY4OTMgMjguMzEzM0MyNC42OTU4IDI4LjMxMTUgMjQuNzAyMyAyOC4zMDk4IDI0LjcwODggMjguMzA3OEMyNC43MTY1IDI4LjMwNTUgMjQuNzI0MiAyOC4zMDMxIDI0LjczMTggMjguMzAwNUMyNC43Mzc1IDI4LjI5ODYgMjQuNzQzMyAyOC4yOTY4IDI0Ljc0OSAyOC4yOTQ3QzI0Ljc1NzggMjguMjkxNiAyNC43NjY1IDI4LjI4ODIgMjQuNzc1MiAyOC4yODQ4QzI0Ljc3OTcgMjguMjgzIDI0Ljc4NDIgMjguMjgxNCAyNC43ODg2IDI4LjI3OTVDMjQuODAxOCAyOC4yNzQgMjQuODE0OCAyOC4yNjgyIDI0LjgyNzYgMjguMjYyQzI0LjgyNzggMjguMjYxOSAyNC44MjgxIDI4LjI2MTcgMjQuODI4NCAyOC4yNjE2QzI0Ljg0MDkgMjguMjU1NSAyNC44NTMyIDI4LjI0OTEgMjQuODY1MyAyOC4yNDI1QzI0Ljg2OTUgMjguMjQwMSAyNC44NzM3IDI4LjIzNzYgMjQuODc4IDI4LjIzNTJDMjQuODg2IDI4LjIzMDUgMjQuODk0IDI4LjIyNTkgMjQuOTAxOCAyOC4yMjFDMjQuOTA2OCAyOC4yMTc5IDI0LjkxMTcgMjguMjE0NyAyNC45MTY3IDI4LjIxMTRDMjQuOTIzNiAyOC4yMDY5IDI0LjkzMDUgMjguMjAyMyAyNC45Mzc0IDI4LjE5NzVDMjQuOTQyNCAyOC4xOTM5IDI0Ljk0NzUgMjguMTkwMyAyNC45NTI1IDI4LjE4NjZDMjQuOTU5MSAyOC4xODE4IDI0Ljk2NTcgMjguMTc2NyAyNC45NzIxIDI4LjE3MTdDMjQuOTc3IDI4LjE2NzkgMjQuOTgxOCAyOC4xNjQyIDI0Ljk4NjUgMjguMTYwM0MyNC45OTM3IDI4LjE1NDMgMjUuMDAwOCAyOC4xNDgxIDI1LjAwNzggMjguMTQxOUMyNS4wMTE1IDI4LjEzODcgMjUuMDE1MiAyOC4xMzU2IDI1LjAxODggMjguMTMyM0MyNS4wMjkxIDI4LjEyMjggMjUuMDM5MiAyOC4xMTMxIDI1LjA0OSAyOC4xMDMxQzI1LjA1MiAyOC4xMDAxIDI1LjA1NDkgMjguMDk2OCAyNS4wNTc4IDI4LjA5MzdDMjUuMDY0OSAyOC4wODYyIDI1LjA3MiAyOC4wNzg2IDI1LjA3ODggMjguMDcwOUMyNS4wODIyIDI4LjA2NyAyNS4wODU2IDI4LjA2MyAyNS4wODg5IDI4LjA1OUMyNS4wOTUzIDI4LjA1MTYgMjUuMTAxNCAyOC4wNDQgMjUuMTA3NSAyOC4wMzYzQzI1LjEwOTQgMjguMDMzOCAyNS4xMTE0IDI4LjAzMTYgMjUuMTEzNCAyOC4wMjkxTDI2LjY1ODcgMjYuMDEzOUMyNi45MjY3IDI1LjY2NDMgMjYuODYwNyAyNS4xNjM3IDI2LjUxMTEgMjQuODk1NkMyNi4xNjE2IDI0LjYyNzYgMjUuNjYwOSAyNC42OTM2IDI1LjM5MjkgMjUuMDQzMkwyNC45MTc3IDI1LjY2MjhMMjMuODU2NSAyMC4zNTcxTDI5LjE2MjEgMjEuNDE4MkwyNy43NzE4IDIyLjQ4NEMyNy41ODk1IDIyLjYyMzggMjcuNDc2MyAyMi44MzU0IDI3LjQ2MTIgMjMuMDY0N0MyNy40NDYxIDIzLjI5MzkgMjcuNTMwNyAyMy41MTg1IDI3LjY5MzEgMjMuNjgxTDMxLjIxNjIgMjcuMjA0QzMxLjIxNjYgMjcuMjA0NCAzMS4yMTY5IDI3LjIwNDggMzEuMjE3MyAyNy4yMDUyQzMxLjM1ODcgMjcuMzQ2NiAzMS4zNTg3IDI3LjU3NjcgMzEuMjE3MyAyNy43MTgxQzMxLjA3NTkgMjcuODU5NSAzMC44NDU3IDI3Ljg1OTUgMzAuNzA0MyAyNy43MTgxQzMwLjM5MjkgMjcuNDA2NiAyOS44ODc5IDI3LjQwNjcgMjkuNTc2NCAyNy43MTgxQzI5LjI2NDkgMjguMDI5NiAyOS4yNjQ5IDI4LjUzNDYgMjkuNTc2MyAyOC44NDYxQzI5Ljk1OCAyOS4yMjc4IDMwLjQ1OTMgMjkuNDE4NiAzMC45NjA3IDI5LjQxODZDMzEuNDYyMSAyOS40MTg2IDMxLjk2MzUgMjkuMjI3NyAzMi4zNDUyIDI4Ljg0NjFDMzIuNzE1IDI4LjQ3NjMgMzIuOTE4NyAyNy45ODQ2IDMyLjkxODcgMjcuNDYxNkMzMi45MTg3IDI2Ljk1MDYgMzIuNzIzNyAyNi40Njk4IDMyLjM2OTggMjYuMTAzMUMzMi4zNjE4IDI2LjA5NDIgMzIuMzUzNiAyNi4wODU1IDMyLjM0NTEgMjYuMDc3WiIgZmlsbD0iIzJEMzJBQSIvPgo8L3N2Zz4K`
const svgMiro = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTM1LjYwMTIgMzIuNDgzNEMzMy44ODIgMzIuNDgzNCAzMi40ODMzIDMzLjg4MjEgMzIuNDgzMyAzNS42MDEzQzMyLjQ4MzMgMzcuMzIwNCAzMy44ODIgMzguNzE5IDM1LjYwMTIgMzguNzE5QzM3LjMyMDMgMzguNzE5IDM4LjcxOSAzNy4zMjA0IDM4LjcxOSAzNS42MDEzQzM4LjcxOSAzMy44ODIxIDM3LjMyMDMgMzIuNDgzNCAzNS42MDEyIDMyLjQ4MzRaTTM1LjYwMTIgMzcuMTIzOUMzNC43NjE2IDM3LjEyMzkgMzQuMDc4NSAzNi40NDA4IDM0LjA3ODUgMzUuNjAxM0MzNC4wNzg1IDM0Ljc2MTYgMzQuNzYxNiAzNC4wNzg2IDM1LjYwMTIgMzQuMDc4NkMzNi40NDA3IDM0LjA3ODYgMzcuMTIzOCAzNC43NjE2IDM3LjEyMzggMzUuNjAxM0MzNy4xMjM4IDM2LjQ0MDggMzYuNDQwNyAzNy4xMjM5IDM1LjYwMTIgMzcuMTIzOVoiIGZpbGw9IiMyRDMyQUEiLz4KPHBhdGggZD0iTTEzLjU1ODkgMzQuODAzNkMxMi4wNzk2IDM0LjgwMzYgMTAuODc2MSAzMy42MDAxIDEwLjg3NjEgMzIuMTIwOFYyNy40ODA0QzEwLjg3NjEgMjYuMDAxMSAxMi4wNzk2IDI0Ljc5NzYgMTMuNTU4OSAyNC43OTc2SDE4LjY2NTVDMTkuMDE4OCAyNi4xMzE2IDIwLjIzNjIgMjcuMTE3OCAyMS42Nzk4IDI3LjExNzhDMjMuMzk5IDI3LjExNzggMjQuNzk3NyAyNS43MTkyIDI0Ljc5NzcgMjRDMjQuNzk3NyAyMi4yODA4IDIzLjM5OSAyMC44ODIyIDIxLjY3OTggMjAuODgyMkMyMC4yMzYzIDIwLjg4MjIgMTkuMDE4OCAyMS44Njg0IDE4LjY2NTUgMjMuMjAyNEgxMy41NTg5QzExLjIgMjMuMjAyNCA5LjI4MDk0IDI1LjEyMTUgOS4yODA5NCAyNy40ODA0VjMyLjEyMDhDOS4yODA5NCAzNC40Nzk3IDExLjIgMzYuMzk4OCAxMy41NTg5IDM2LjM5ODhDMTMuOTk5NCAzNi4zOTg4IDE0LjM1NjUgMzYuMDQxNyAxNC4zNTY1IDM1LjYwMTJDMTQuMzU2NSAzNS4xNjA3IDEzLjk5OTQgMzQuODAzNiAxMy41NTg5IDM0LjgwMzZaTTIxLjY3OTggMjIuNDc3M0MyMi41MTk0IDIyLjQ3NzMgMjMuMjAyNSAyMy4xNjA0IDIzLjIwMjUgMjRDMjMuMjAyNSAyNC44Mzk2IDIyLjUxOTQgMjUuNTIyNyAyMS42Nzk4IDI1LjUyMjdDMjAuODQwMiAyNS41MjI3IDIwLjE1NzIgMjQuODM5NiAyMC4xNTcyIDI0QzIwLjE1NzIgMjMuMTYwNCAyMC44NDAyIDIyLjQ3NzMgMjEuNjc5OCAyMi40NzczWiIgZmlsbD0iIzJEMzJBQSIvPgo8cGF0aCBkPSJNMzcuNDY2IDEyLjg1NDJDMzYuNjU4IDEyLjA0NjIgMzUuNTgzNyAxMS42MDEyIDM0LjQ0MTEgMTEuNjAxMkgxNS40MTNDMTUuMDU5NyAxMC4yNjcyIDEzLjg0MjMgOS4yODA5OCAxMi4zOTg4IDkuMjgwOThDMTAuNjc5NiA5LjI4MDk4IDkuMjgwOTQgMTAuNjc5NiA5LjI4MDk0IDEyLjM5ODhDOS4yODA5NCAxNC4xMTggMTAuNjc5NiAxNS41MTY2IDEyLjM5ODggMTUuNTE2NkMxMy44NDIzIDE1LjUxNjYgMTUuMDU5NyAxNC41MzA0IDE1LjQxMzEgMTMuMTk2NEgzNC40NDExQzM1LjE1NzcgMTMuMTk2NCAzNS44MzE0IDEzLjQ3NTQgMzYuMzM4MSAxMy45ODIyQzM2Ljg0NDggMTQuNDg4OSAzNy4xMjM5IDE1LjE2MjYgMzcuMTIzOCAxNS44NzkyVjIwLjUxOTdDMzcuMTIzOSAyMS4yMzYyIDM2Ljg0NDggMjEuOTA5OSAzNi4zMzgxIDIyLjQxNjZDMzUuODMxNCAyMi45MjM0IDM1LjE1NzcgMjMuMjAyNCAzNC40NDExIDIzLjIwMjRIMjkuNDA1OUwzMC4zNjQ2IDIyLjI0MzhDMzAuNjc2IDIxLjkzMjMgMzAuNjc2IDIxLjQyNzMgMzAuMzY0NiAyMS4xMTU4QzMwLjA1MzEgMjAuODA0MyAyOS41NDgxIDIwLjgwNDMgMjkuMjM2NiAyMS4xMTU4TDI2LjkxNjQgMjMuNDM2QzI2LjkwNzIgMjMuNDQ1MiAyNi44OTgyIDIzLjQ1NDcgMjYuODg5NSAyMy40NjQzQzI2Ljg4NzMgMjMuNDY2NyAyNi44ODUzIDIzLjQ2OTIgMjYuODgzMSAyMy40NzE2QzI2Ljg3NjYgMjMuNDc5IDI2Ljg3MDEgMjMuNDg2NCAyNi44NjM5IDIzLjQ5NEMyNi44NjIxIDIzLjQ5NjEgMjYuODYwNCAyMy40OTg0IDI2Ljg1ODYgMjMuNTAwNkMyNi44NTIyIDIzLjUwODYgMjYuODQ1OCAyMy41MTY3IDI2LjgzOTYgMjMuNTI1QzI2LjgzODYgMjMuNTI2NSAyNi44Mzc2IDIzLjUyOCAyNi44MzY1IDIzLjUyOTRDMjYuODI5OCAyMy41Mzg2IDI2LjgyMzIgMjMuNTQ3OCAyNi44MTY5IDIzLjU1NzNDMjYuODE2NiAyMy41NTc4IDI2LjgxNjMgMjMuNTU4MiAyNi44MTYxIDIzLjU1ODZDMjYuNzQ1NiAyMy42NjQ0IDI2LjY5OTggMjMuNzg3OSAyNi42ODY3IDIzLjkyMUMyNi42ODY1IDIzLjkyMjcgMjYuNjg2NCAyMy45MjQ0IDI2LjY4NjMgMjMuOTI2MUMyNi42ODUzIDIzLjkzNzQgMjYuNjg0NCAyMy45NDg2IDI2LjY4MzggMjMuOTYwMUMyNi42ODMxIDIzLjk3MzMgMjYuNjgyOCAyMy45ODY2IDI2LjY4MjggMjRDMjYuNjgyOCAyNC4wMTMzIDI2LjY4MzEgMjQuMDI2NyAyNi42ODM4IDI0LjAzOTlDMjYuNjg0NCAyNC4wNTE1IDI2LjY4NTMgMjQuMDYyOSAyNi42ODYzIDI0LjA3NDNDMjYuNjg2NSAyNC4wNzU5IDI2LjY4NjUgMjQuMDc3NCAyNi42ODY3IDI0LjA3OUMyNi42OTk4IDI0LjIxMjMgMjYuNzQ1OCAyNC4zMzU5IDI2LjgxNjMgMjQuNDQxOEMyNi44MTY1IDI0LjQ0MiAyNi44MTY2IDI0LjQ0MjQgMjYuODE2OSAyNC40NDI2QzI2LjgyMzMgMjQuNDUyMiAyNi44Mjk5IDI0LjQ2MTYgMjYuODM2OCAyNC40NzA5QzI2LjgzNzggMjQuNDcyMyAyNi44Mzg3IDI0LjQ3MzcgMjYuODM5NyAyNC40NzVDMjYuODQ1OCAyNC40ODMzIDI2Ljg1MjIgMjQuNDkxNCAyNi44NTg3IDI0LjQ5OTVDMjYuODYwNSAyNC41MDE3IDI2Ljg2MjEgMjQuNTAzOSAyNi44NjM5IDI0LjUwNjFDMjYuODcwMSAyNC41MTM3IDI2Ljg3NjYgMjQuNTIxMSAyNi44ODMyIDI0LjUyODRDMjYuODg1MyAyNC41MzA4IDI2Ljg4NzQgMjQuNTMzMyAyNi44ODk1IDI0LjUzNTdDMjYuODk4MiAyNC41NDU0IDI2LjkwNzIgMjQuNTU0OCAyNi45MTY0IDI0LjU2NEwyOS4yMzY3IDI2Ljg4NDNDMjkuMzkyNCAyNy4wNCAyOS41OTY1IDI3LjExNzkgMjkuODAwNiAyNy4xMTc5QzMwLjAwNDggMjcuMTE3OSAzMC4yMDg5IDI3LjA0IDMwLjM2NDYgMjYuODg0M0MzMC42NzYxIDI2LjU3MjggMzAuNjc2MSAyNi4wNjc4IDMwLjM2NDYgMjUuNzU2M0wyOS40MDU5IDI0Ljc5NzZIMzQuNDQxMUMzNS41ODM3IDI0Ljc5NzYgMzYuNjU4IDI0LjM1MjYgMzcuNDY2IDIzLjU0NDZDMzguMjc0MSAyMi43MzY2IDM4LjcxOTEgMjEuNjYyMyAzOC43MTkgMjAuNTE5NlYxNS44NzkyQzM4LjcxOTEgMTQuNzM2NSAzOC4yNzQxIDEzLjY2MjIgMzcuNDY2IDEyLjg1NDJaTTEyLjM5ODggMTMuOTIxNUMxMS41NTkyIDEzLjkyMTUgMTAuODc2MSAxMy4yMzg0IDEwLjg3NjEgMTIuMzk4OEMxMC44NzYxIDExLjU1OTIgMTEuNTU5MiAxMC44NzYxIDEyLjM5ODggMTAuODc2MUMxMy4yMzgzIDEwLjg3NjEgMTMuOTIxNCAxMS41NTkyIDEzLjkyMTQgMTIuMzk4OEMxMy45MjE0IDEzLjIzODQgMTMuMjM4MyAxMy45MjE1IDEyLjM5ODggMTMuOTIxNVoiIGZpbGw9IiMyRDMyQUEiLz4KPHBhdGggZD0iTTMwLjQxNyAzNi4xMDczQzMwLjQxODggMzYuMTA1MiAzMC40MjA0IDM2LjEwMjkgMzAuNDIyMiAzNi4xMDA3QzMwLjQyODcgMzYuMDkyNyAzMC40MzUxIDM2LjA4NDUgMzAuNDQxMyAzNi4wNzYyQzMwLjQ0MjMgMzYuMDc0OSAzMC40NDMyIDM2LjA3MzUgMzAuNDQ0MiAzNi4wNzIyQzMwLjQ1MSAzNi4wNjI5IDMwLjQ1NzcgMzYuMDUzNCAzMC40NjQxIDM2LjA0MzhDMzAuNDY0MyAzNi4wNDM2IDMwLjQ2NDUgMzYuMDQzMiAzMC40NjQ3IDM2LjA0M0MzMC41MzUyIDM1LjkzNzEgMzAuNTgxMSAzNS44MTM1IDMwLjU5NDMgMzUuNjgwMkMzMC41OTQ0IDM1LjY3ODcgMzAuNTk0NSAzNS42NzcxIDMwLjU5NDYgMzUuNjc1NUMzMC41OTU2IDM1LjY2NDEgMzAuNTk2NiAzNS42NTI3IDMwLjU5NzIgMzUuNjQxMkMzMC41OTc5IDM1LjYyNzkgMzAuNTk4MiAzNS42MTQ2IDMwLjU5ODIgMzUuNjAxMkMzMC41OTgyIDM1LjU4NzkgMzAuNTk3OSAzNS41NzQ1IDMwLjU5NzIgMzUuNTYxM0MzMC41OTY2IDM1LjU0OTkgMzAuNTk1NyAzNS41Mzg2IDMwLjU5NDYgMzUuNTI3M0MzMC41OTQ1IDM1LjUyNTYgMzAuNTk0NSAzNS41MjM5IDMwLjU5NDMgMzUuNTIyMkMzMC41ODExIDM1LjM4OTEgMzAuNTM1MyAzNS4yNjU2IDMwLjQ2NDkgMzUuMTU5OEMzMC40NjQ2IDM1LjE1OTQgMzAuNDY0MyAzNS4xNTkgMzAuNDY0MSAzNS4xNTg1QzMwLjQ1NzcgMzUuMTQ5MSAzMC40NTEyIDM1LjEzOTggMzAuNDQ0NSAzNS4xMzA2QzMwLjQ0MzQgMzUuMTI5MiAzMC40NDI0IDM1LjEyNzcgMzAuNDQxMyAzNS4xMjYyQzMwLjQzNTIgMzUuMTE3OSAzMC40Mjg4IDM1LjEwOTkgMzAuNDIyMyAzNS4xMDE4QzMwLjQyMDYgMzUuMDk5NiAzMC40MTg5IDM1LjA5NzQgMzAuNDE3MSAzNS4wOTUyQzMwLjQxMDkgMzUuMDg3NiAzMC40MDQ0IDM1LjA4MDEgMzAuMzk3OCAzNS4wNzI4QzMwLjM5NTcgMzUuMDcwNCAzMC4zOTM2IDM1LjA2NzkgMzAuMzkxNSAzNS4wNjU1QzMwLjM4MjggMzUuMDU1OSAzMC4zNzM4IDM1LjA0NjQgMzAuMzY0NiAzNS4wMzcyTDI4LjA0NDMgMzIuNzE3QzI3LjczMjggMzIuNDA1NSAyNy4yMjc4IDMyLjQwNTUgMjYuOTE2NCAzMi43MTdDMjYuNjA0OSAzMy4wMjg0IDI2LjYwNDkgMzMuNTMzNCAyNi45MTY0IDMzLjg0NDlMMjcuODc1IDM0LjgwMzdIMTkuMzU5NUMxOC45MTkgMzQuODAzNyAxOC41NjE5IDM1LjE2MDggMTguNTYxOSAzNS42MDEzQzE4LjU2MTkgMzYuMDQxOCAxOC45MTkgMzYuMzk4OSAxOS4zNTk1IDM2LjM5ODlIMjcuODc1TDI2LjkxNjMgMzcuMzU3NkMyNi42MDQ4IDM3LjY2OTEgMjYuNjA0OCAzOC4xNzQxIDI2LjkxNjMgMzguNDg1NkMyNy4wNzIgMzguNjQxMyAyNy4yNzYxIDM4LjcxOTIgMjcuNDgwMyAzOC43MTkyQzI3LjY4NDQgMzguNzE5MiAyNy44ODg1IDM4LjY0MTMgMjguMDQ0MyAzOC40ODU2TDMwLjM2NDUgMzYuMTY1M0MzMC4zNzM3IDM2LjE1NjEgMzAuMzgyNyAzNi4xNDY2IDMwLjM5MTQgMzYuMTM3QzMwLjM5MzYgMzYuMTM0NiAzMC4zOTU2IDM2LjEzMjEgMzAuMzk3OCAzNi4xMjk3QzMwLjQwNDMgMzYuMTIyMyAzMC40MTA4IDM2LjExNDkgMzAuNDE3IDM2LjEwNzNaIiBmaWxsPSIjMkQzMkFBIi8+Cjwvc3ZnPgo=`
function ShowLink(props: { link: IIconLink }): JSX.Element {
  const {
    link
  } = props;
  let img : JSX.Element = null
  switch (link.icon.toLowerCase().trim()) {
    case "figma_mobile":
      img =  <img  src={svgFigmaMobile} />
      break

    case "figma_desktop":
      img =  <img src={svgFigmaMobile} />
      break
      case "miro":
        img =  <img src={svgMiro} />
        break
    default:
        return null
      break
  }
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{height:"30px",alignSelf:"center"}}>
      {img}
    </a>
  )
}

function ShowLinks(props: { link: ILinkItem }): JSX.Element {
  const {
    link
  } = props;
  return (
    <div style={{ display: "flex" }}>
      <div style= {{flexGrow:1, alignSelf: "center"}}>
        {link.title}
      </div>
      <div style={{minWidth:"100px"}}>
        {link.iconLinks.map((iconLink, key) => <ShowLink key={key} link={iconLink} />)}

      </div>
    </div>
  )
}
export default function Links(props: ILinksProps): JSX.Element {


  const {
    links,
    hasTeamsContext
  } = props;
  const [linkList, setlinkList] = useState<ILinkItem[]>([])
  React.useEffect(() => {


    /**
     *  Expect a multi line string as input
     *  Each line is split by | to get the title and the links
     * 
     *  Sample
     *  -----------
    //  Title 1|link1|icon1|link2|icon\n
     *  Title 2|link1|icon1|link2|icon2
     * 
     * New Card and Account  - Physical and/or Digital Card   |   miro   |   https://miro.com/app/board/uXjVPPWSdHw=/?moveToWidget=3458764540765962317&cot=14   |   New Card and Account  - Physical and/or Digital Card   |   miro   |   https://miro.com/app/board/uXjVPPWSdHw=/?moveToWidget=3458764540765962317&cot=14   |   figma_mobile   |   https://www.figma.com/proto/pB0IDzBRf6n1xXMYF4wjNW/Card-journeys?page-id=247%3A220673&node-id=455%3A464927&viewport=1386%2C645%2C0.1&scaling=scale-down&starting-point-node-id=455%3A464927&show-proto-sidebar=1   |   https://www.figma.com/proto/pB0IDzBRf6n1xXMYF4wjNW/Card-journeys?page-id=247%3A220673&node-id=455%3A464927&viewport=1386%2C645%2C0.1&scaling=scale-down&starting-point-node-id=455%3A464927&show-proto-sidebar=1
     */
    if (!links) {
      return;
    }

    const linkListParsed = links.split('\n').map((link) => {
      const [title, ...iconLinks] = link.split('|');
      const parsedLinks: IIconLink[] = []
      const iconLink: IIconLink = {
        url: "",
        icon: ""
      }


      iconLinks.forEach((link: string) => {
        if (iconLink.icon) {
          iconLink.url = link
          const l = { ...iconLink }
          parsedLinks.push(l);
          iconLink.icon = ""
        } else {
          iconLink.icon = link
        }

      }


      );
      return {
        title,
        iconLinks: parsedLinks
      }

    }

    );
    setlinkList(linkListParsed);
  }, [links]);

  return (
    <section className={`${styles.links} ${hasTeamsContext ? styles.teams : ''}`}>
      {linkList.map((link, key) => <ShowLinks key={key} link={link} />)}
    </section>
  );

}
