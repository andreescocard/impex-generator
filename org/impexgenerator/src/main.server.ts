import 'zone.js/node';
import '@angular/platform-server/init';

import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

if (import.meta.env.PROD) {
  enableProdMode();
}

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, {...config, providers: [provideZoneChangeDetection(), ...config.providers]}, context);

export default async function render(url: string, document: string) {
  const html = await renderApplication(bootstrap, {
    document,
    url,
  });
  return html;
}
