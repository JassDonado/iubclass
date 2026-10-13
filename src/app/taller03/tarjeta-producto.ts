import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from './modelos';

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <article class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="text-lg font-bold text-slate-900">{{ producto().nombre }}</h3>

      <p class="mt-1 text-sm text-slate-500">
        {{ producto().precio | currency: 'COP' : 'symbol' : '1.0-0' }}
      </p>

      <p class="mt-1 text-sm text-slate-500">Disponibles: {{ disponibles() }}</p>

      <button
        type="button"
        class="mt-3 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
        [disabled]="disponibles() === 0"
        (click)="onAgregar()"
      >
        Agregar
      </button>
    </article>
  `,
})
export class TarjetaProducto {
  producto = input.required<Producto>();
  enPedido = input<number>(0);

  disponibles = computed(() => this.producto().existencias - this.enPedido());

  agregar = output<string>();

  onAgregar() {
    this.agregar.emit(this.producto().nombre);
  }
}
