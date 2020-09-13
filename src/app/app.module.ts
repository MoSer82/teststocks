import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'info',
        pathMatch: 'full',
        loadChildren: () => import('./stocks-info/stocks-info.module').then(m => m.StocksInfoModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'info'
  }
]

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
