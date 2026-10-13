import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Linea } from './modelos';

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-lg font-bold text-slate-900">Resumen del pedido</h2>

      <ul class="mt-4 divide-y divide-slate-100">
        @for (linea of lineas(); track linea.nombre) {
          <li class="flex items-center justify-between py-2 text-sm">
            <div>
              <p class="font-semibold text-slate-900">{{ linea.nombre }}</p>
              <p class="text-slate-500">
                {{ linea.cantidad }} ×
                {{ linea.precio | currency: 'COP' : 'symbol' : '1.0-0' }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-semibold text-slate-900">
                {{ linea.precio * linea.cantidad | currency: 'COP' : 'symbol' : '1.0-0' }}
              </span>
              <button
                type="button"
                class="rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700"
                (click)="quitar.emit(linea.nombre)"
              >
                Quitar
              </button>
            </div>
          </li>
        } @empty {
          <li class="py-6 text-center text-sm text-slate-400">El pedido está vacío</li>
        }
      </ul>

      <dl class="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
        <div class="flex justify-between text-slate-600">
          <dt>Subtotal</dt>
          <dd>{{ subtotal() | currency: 'COP' : 'symbol' : '1.0-0' }}</dd>
        </div>
        <div class="flex justify-between text-slate-600">
          <dt>Domicilio</dt>
          <dd>
            @if (domicilio() === 0) {
              Gratis
            } @else {
              {{ domicilio() | currency: 'COP' : 'symbol' : '1.0-0' }}
            }
          </dd>
        </div>
        <div class="flex justify-between text-base font-bold text-slate-900">
          <dt>Total</dt>
          <dd>{{ total() | currency: 'COP' : 'symbol' : '1.0-0' }}</dd>
        </div>
      </dl>
    </section>
  `,
})
export class ResumenPedido {
  lineas = input.required<Linea[]>();

  quitar = output<string>();

  subtotal = computed(() =>
    this.lineas().reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0),
  );

  domicilio = computed(() => {
    const sub = this.subtotal();
    if (sub === 0 || sub >= 20000) return 0;
    return 3000;
  });

  total = computed(() => this.subtotal() + this.domicilio());
}
