import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Observable } from 'rxjs';
import { Carrito } from 'src/app/Interfaces/carrito';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CarritoServiService {

  private apiUrl = 'http://127.0.0.1:8000/modelo/';
  // private apiUrl = 'https://greenmarket.up.railway.app/modelo/';
  // BehaviorSubject to track number of items in the cart
  private cartItemCount = new BehaviorSubject<number>(0);
  cantidadCarrito = new EventEmitter<number>();
  private cantidadActual = 0;
  constructor(private http: HttpClient) { }

  ver_carrito(): Observable<any> {
    return this.http.get(`${this.apiUrl}carrito/`); // Asegúrate de que la URL sea correcta
}

  agregar_Carrito(productoId: number): Observable<any> {
    const url = `${this.apiUrl}agregar/${productoId}/`;
    this.cantidadActual++;
    this.cantidadCarrito.emit(this.cantidadActual);
    return this.http.post(url, {}, { withCredentials: true });

  }

   // Implementación del método restar_carrito
  restar_carrito(productId: number): Observable<any> {
    const url = `${this.apiUrl}restar/${productId}/`;
    return this.http.post(url, {}, { withCredentials: true });
  }

  iniciarPago(data: { total: number,orden_id:number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}pago/iniciar/`, data);
  }

  // Método para limpiar el carrito
  limpiarCarrito(): Observable<any> {
    const url = `${this.apiUrl}limpiar/`; // Asegúrate de que esta URL sea correcta
    return this.http.post(url, {}, { withCredentials: true });
  }

  // Método para eliminar un item del carrito
  eliminar_carrito(productId: number): Observable<any> {
    const url = `${this.apiUrl}eliminar/${productId}/`;
    return this.http.post(url, {}, { withCredentials: true });
  }

  // Getter for the cart item count observable
  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  // Method to update the cart item count
  updateCartCount() {
    this.ver_carrito();
  }

  checkout(data: any) {
    const headers = { 'Content-Type': 'application/json' }; // Asegúrate de tener las cabeceras
    return this.http.post('http://127.0.0.1:8000/modelo/crear_oden/', data, { headers });
  }

  //PRODUCCION
  // checkout(data: any) {
  //   const headers = { 'Content-Type': 'application/json' }; // Asegúrate de tener las cabeceras
  //   return this.http.post('https://web-production-8ca5.up.railway.app/modelo/crear_oden/', data, { headers });
  // }

  cliente_obtener(rut: string): Observable<any> {
    console.log(`Fetching client with RUT: ${rut}`);  // Agrega esto para verificar el RUT en consola
    return this.http.get(`${this.apiUrl}cliente/${rut}`);
  }
  // Crear un nuevo cliente
  crearCliente(clienteData: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' }; // Asegúrate de tener las cabeceras
    return this.http.post(`${this.apiUrl}clienteAgre/`, clienteData, { headers });
  }
// CarritoServiService (servicio de Angular)
  obtenerDetallesPagoExitoso(order: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}detalles-pago-exitoso/?order=${order}`);
  }
  obtenerCantidadCarrito() {
    return this.cantidadActual;
  }
}
