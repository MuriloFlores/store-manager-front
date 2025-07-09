import {Routes} from '@angular/router';
import {ProductManagementComponent} from './pages/product-management/product-management';


export const INVENTORY_ROUTES: Routes = [
  {path: '', component: ProductManagementComponent, title: 'Gerenciar Inventário'}
];
