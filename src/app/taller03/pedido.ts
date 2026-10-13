import { Component, computed, signal } from '@angular/core';
import { Linea, Producto } from './modelos';
import { TarjetaProducto } from './tarjeta-producto';
import { ResumenPedido } from './resumen-pedido';

@Component({
  selector: 'app-pedido',
  imports: [TarjetaProducto, ResumenPedido],
  template: `
    <section class="mt-6">
      <h1 class="text-2xl font-bold text-slate-900">Taller 03 · Pedido</h1>
      <p class="mt-1 text-sm text-slate-500">
        Componentes que se comunican con input, output y signals
      </p>

      <div class="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div class="grid gap-4 sm:grid-cols-2">
          @for (producto of productos; track producto.nombre) {
            <app-tarjeta-producto
              [producto]="producto"
              [enPedido]="unidadesPorProducto()[producto.nombre] ?? 0"
              (agregar)="agregar($event)"
            />
          }
        </div>

        <app-resumen-pedido [lineas]="lineas()" (quitar)="quitar($event)" />
      </div>
    </section>
  `,
})
export class Pedido {
  private pedidoSignal = signal<Linea[]>([]);

  lineas = computed(() => this.pedidoSignal());

  productos: Producto[] = [
    { nombre: 'Mango', precio: 1800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12000, existencias: 1 },
  ];

  unidadesPorProducto = computed(() => {
    const mapa: Record<string, number> = {};
    for (const linea of this.pedidoSignal()) {
      mapa[linea.nombre] = linea.cantidad;
    }
    return mapa;
  });

  agregar(nombre: string) {
    const producto = this.productos.find((p) => p.nombre === nombre);
    if (!producto) return;

    this.pedidoSignal.update((lineas) => {
      const existente = lineas.find((linea) => linea.nombre === nombre);
      if (existente) {
        return lineas.map((linea) =>
          linea.nombre === nombre ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
        );
      }
      return [...lineas, { nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  }

  quitar(nombre: string) {
    this.pedidoSignal.update((lineas) => lineas.filter((linea) => linea.nombre !== nombre));
  }
}
