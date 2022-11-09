import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: "",
    redirectTo: "general",
    pathMatch: "full"
  },   
  {
    path:'words',
    loadChildren:()=>import('./pages/words/words.module').then(m=> m.WordsModule)
  },   
  {
    path:'general',
    loadChildren:()=>import('./pages/general/general.module').then(m=> m.GeneralModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
