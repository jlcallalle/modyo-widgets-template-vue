<template>
  <div
    class="widget-operaciones-fx"
    :class="[solicitarPrecio == false ? 'widget-operaciones-fx' : 'widget-operacion-comprar-vender' ]">
    <h1
      class="mb-4 title-widget">
      Operaciones <span>
        FX
      </span>
    </h1>
    <p style="display:none">
      isTwoway: {{ isTwoway }}
    </p>
    <div
      v-if="loading"
      class="invex-loader">
      <div class="invex-loader_spinner" />
    </div>
    <div class="container container-widget">
      <div class="row">
        <div class="col-md-12 col-xl-8 box-operaciones">
          <form @submit.prevent="enterForm">
            <div class="row">
              <div
                class="col-12"
                :class="operacionSeleccionada === 'BLOCKTRADE' ? 'col-md-4' : 'col-md-6' ">
                <div class="form-group">
                  <label
                    for="tipoOperacionlSelect"
                    class="title-group">Operación:</label>
                  <select
                    id="tipoOperacionlSelect"
                    class="form-control"
                    :value="operacionSeleccionada"
                    :disabled="solicitarPrecio"
                    @change="seleccionarOperacion($event)">
                    <option
                      v-for="(value, key, index) in listarOperacion"
                      :key="index"
                      :value="value.productCode"
                      :selected="key === 0">
                      {{ value.productCode }}
                    </option>
                  </select>
                </div>
              </div>
              <div
                class="col-12"
                :class="operacionSeleccionada === 'BLOCKTRADE' ? 'col-md-4' : 'col-md-6' ">
                <div class="form-group">
                  <label
                    for="tipoDivisasSelect"
                    class="title-group">Par de divisas:</label>
                  <select
                    id="tipoDivisasSelect"
                    class="form-control"
                    :disabled="solicitarPrecio"
                    :value="currencySelectedId"
                    @change="setCurrenciesOptions($event)">
                    <option
                      v-for="(currency, index) in currenciesOptions"
                      :id="index"
                      :key="index"
                      :value="index">
                      {{ currency.Ccy1 }} / {{ currency.Ccy2 }}
                    </option>
                  </select>
                </div>
              </div>
              <div
                v-if="operacionSeleccionada === 'BLOCKTRADE'"
                class="col-12 col-md-4">
                <div class="form-group">
                  <label
                    for="divisaSelect"
                    class="title-group">
                    Divisa:</label>
                  <select
                    name="select"
                    class="form-control"
                    :disabled="solicitarPrecio"
                    @change="setCurrencySelected($event)">
                    <option
                      v-for="(currency, index) in currenciesSelected"
                      :id="index"
                      :key="index"
                      :selected="currencySelected === currency"
                      :value="currency">
                      {{ currency }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div
              v-if="operacionSeleccionada === 'BLOCKTRADE' && !solicitarPrecio"
              class="row">
              <div class="col-12">
                <div class="box-block-trade">
                  <div class="header-trade">
                    <div class="row">
                      <div class="col-6">
                        <div class="fecha-trade">
                          Fecha de Liquidación
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="divisa-trade">
                          Monto en <span>({{ currencySelected }}) </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="content-trade"
                    :class="[blockTradeRows.length >= 5 ? 'block-scroll' : '' ]">
                    <div
                      v-for="(blockTradeRow, indexRow) in blockTradeRows"
                      :key="indexRow"
                      class="row row-opera">
                      <div class="col-12 col-md-6">
                        <div class="box-periodo input-group">
                          <div class="group-select">
                            <div class="title-group title-fecha">
                              Periodo
                            </div>
                            <select
                              id="fecha-calendario"
                              name="select"
                              class="select-fecha"
                              :disabled="solicitarPrecio"
                              @change="setCalendarBlockTradeRows($event, indexRow)">
                              <option
                                v-for="(calendarOp, indexOptions) in blockTradeRow.calendarOptions"
                                :id="indexOptions"
                                :key="indexOptions"
                                :data-tipo="calendarOp.Description"
                                :selected="blockTradeRow.fechaSeleccionada === calendarOp.date"
                                :value="calendarOp.date">
                                {{ calendarOp.Description }}
                              </option>
                            </select>
                          </div>
                          <div class="box-input-row">
                            <div class="group-select">
                              <div class="title-group title-fecha">
                                Fecha de liquidación
                              </div>
                              <div
                                class="wrapp-fecha">
                                <date-picker
                                  :min-date="new Date()"
                                  :disabled-dates="{ weekdays: [1, 7] }"
                                  :masks="masks"
                                  :model-config="modelConfig"
                                  :value="blockTradeRow.fechaSeleccionada"
                                  :popover="{ visibility: 'click' }"
                                  @dayclick="onDayClickBlockTrade(indexRow, $event)">
                                  <template #default="{ inputValue, inputEvents }">
                                    <input
                                      class="form-control input-fecha"
                                      :value="inputValue"
                                      :disabled="solicitarPrecio"
                                      v-on="inputEvents">
                                  </template>
                                </date-picker>
                              </div>
                              <i class="icon-calendar">
                                <svg
                                  width="24"
                                  height="25"
                                  viewBox="0 0 24 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M16 13.5H13C12.45 13.5 12 13.95 12 14.5V17.5C12 18.05 12.45 18.5 13 18.5H16C16.55 18.5 17 18.05 17 17.5V14.5C17 13.95 16.55 13.5 16 13.5ZM16 3.5V4.5H8V3.5C8 2.95 7.55 2.5 7 2.5C6.45 2.5 6 2.95 6 3.5V4.5H5C3.89 4.5 3.01 5.4 3.01 6.5L3 20.5C3 21.6 3.89 22.5 5 22.5H19C20.1 22.5 21 21.6 21 20.5V6.5C21 5.4 20.1 4.5 19 4.5H18V3.5C18 2.95 17.55 2.5 17 2.5C16.45 2.5 16 2.95 16 3.5ZM18 20.5H6C5.45 20.5 5 20.05 5 19.5V9.5H19V19.5C19 20.05 18.55 20.5 18 20.5Z"
                                    fill="#424242" />
                                </svg>
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div class="wrap-actions">
                          <button
                            class="btn btn-switch"
                            @click="changeBlockTradeRowCompra(indexRow)">
                            <span>
                              <svg
                                width="19"
                                height="28"
                                viewBox="0 0 19 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M14.3773 13.9998L18.1667 10.2104L14.3773 6.4209V9.263H0.166748V11.1577H14.3773V13.9998Z"
                                  fill="#A41D36" />
                                <path
                                  d="M3.95622 14L0.166748 17.7895L3.95622 21.5789V18.7368H18.1667V16.8421H3.95622V14Z"
                                  fill="#A41D36" />
                              </svg>
                            </span>
                            {{ blockTradeRow.compra ? 'Comprar' : 'Vender' }}
                          </button>
                          <div class="form-group-delete">
                            <currency-input
                              id="currencyInput"
                              ref="dataInput"
                              class="form-control input-precio-block-trade"
                              :value="blockTradeRow.nocional"
                              :disabled="solicitarPrecio"
                              :options="currencyOptions"
                              @change="changeBlockTradeNotional(indexRow, $event)" />
                            <a
                              class="icon-delete"
                              @click="removeBlockTradeRow(indexRow)">
                              <svg
                                width="20"
                                height="24"
                                viewBox="0 0 20 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M1.99984 21.3333C1.99984 22.8 3.19984 24 4.6665 24H15.3332C16.7998 24 17.9998 22.8 17.9998 21.3333V5.33333H1.99984V21.3333ZM19.3332 1.33333H14.6665L13.3332 0H6.6665L5.33317 1.33333H0.666504V4H19.3332V1.33333Z"
                                  fill="#666666" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="box-agregar">
                      <button
                        class="btn btn-agregar"
                        @click="addBlockTradeRow">
                        <span>
                          <svg
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M24.5 14.2143H14.2143V24.5H10.7857V14.2143H0.5V10.7857H10.7857V0.5H14.2143V10.7857H24.5V14.2143Z"
                              fill="#A41D36" />
                          </svg>
                        </span>
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 mt-4">
                <div class="row">
                  <div class="col-12 col-md-6">
                    <div class="cantidad">
                      <span>{{ blockTradeRows.length }}</span>
                      {{ blockTradeRows.length !== 1 ? 'Operaciones' : 'Operación' }}
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="total-monto">
                      <span class="title-monto-total">Total de monto cotizado</span>
                      <span class="calculo-monto-total">{{ calculateBlockTradeNotional() }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 mt-4">
                <div class="row-check">
                  <input
                    id="asignaCheck"
                    v-model="checkedInstrucion"
                    type="checkbox"
                    class="check-square-input">
                  <label
                    for="asignaCheck"
                    class="check-square form-check-label" />
                  <span>
                    Asignar instrucciones de liquidación prestablecidas
                  </span>
                </div>
                <div
                  v-if="checkedInstrucion"
                  class="row mostrar-instrucciones">
                  <div class="col-12 col-md-6">
                    <div class="form-group">
                      <label
                        for="selecCuentaOrigen"
                        class="title-cuenta">Cuenta Origen:</label>
                      <select
                        class="form-control"
                        @change="setOrigen($event)">
                        <option
                          v-for="(origen, index) in listadoOrigen"
                          :id="index"
                          :key="index"
                          :selected="origenSelected === origen.customerAccount"
                          :value="origen.customerAccount">
                          {{ origenTxt(origen) }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="form-group">
                      <label
                        for="selecCuentaDestino"
                        class="title-cuenta">
                        Cuenta Destino:</label>
                      <select
                        id="tipoCuentalSelect"
                        class="form-control"
                        @change="setDestino($event)">
                        <option
                          v-for="(destino, index) in listadoDestino"
                          :id="index"
                          :key="index"
                          :selected="destinoSelected === destino.BeneficiaryAccount"
                          :value="destino.BeneficiaryAccount">
                          {{ destinoTxt(destino) }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="operacionSeleccionada == 'BLOCKTRADE' && solicitarPrecio"
              class="row">
              <div class="col-12 col-md-6 mx-auto">
                <div
                  v-if="blockTradeSide === '1' || blockTradeSide === '2'"
                  class="box-vender tipo-venta">
                  <div class="title-operacion">
                    {{ blockTradeSide === '1' ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </div>
                  <div
                    v-if="blockTradeRows[0]"
                    class="box-precio">
                    <span
                      :class="{greenValue: blockTradeRows[0].priceComparation === '+',
                               redValue: blockTradeRows[0].priceComparation === '-'}">
                      {{ formatoPrecioCuatroDigitos(blockTradeRows[0].price) }}
                    </span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="eventOperationBloque">
                    Cerrar Operación
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="operacionSeleccionada !== 'BLOCKTRADE'"
              class="row">
              <div class="col-6">
                <div
                  v-if="!solicitarPrecio ||
                    ( optionSelected !== 'Vender' && optionSelected !== 'Twoway' ||
                      !solicitarPrecio && mostrarTwoWay)"
                  class="box-rfs">
                  <span>RFS</span>
                </div>

                <div
                  v-if="solicitarPrecio && (optionSelected === 'Vender' || optionSelected === 'Twoway')"
                  class="box-vender tipo-venta">
                  <div class="title-operacion">
                    {{ isBuy ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span
                      v-if="operacionSeleccionada !== 'SWAP'"
                      :class="{greenValue: valueComparationSell === '+',
                               redValue: valueComparationSell === '-'}">
                      {{ currencyValueSell }}
                    </span>
                    <span
                      v-else
                      :class="{greenValue: valueComparationSwapPointsSell === '+',
                               redValue: valueComparationSwapPointsSell === '-'}">
                      {{ formatoPrecioCuatroDigitos(formatSwapPointsSell) }}
                    </span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="eventOperation('Vender')">
                    {{ isBuy ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </button>
                </div>
              </div>
              <div class="col-6">
                <div
                  v-if="!solicitarPrecio || (solicitarPrecio && optionSelected === 'Vender'
                    || !solicitarPrecio && mostrarTwoWay)"
                  class="box-rfs">
                  <span>RFS</span>
                </div>

                <div
                  v-if="solicitarPrecio && (optionSelected === 'Comprar' || optionSelected === 'Twoway')"
                  class="box-vender tipo-compra">
                  <div class="title-operacion">
                    {{ isBuy ? 'Vender' : 'Comprar' }} {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span
                      v-if="operacionSeleccionada !== 'SWAP'"
                      :class="{greenValue: valueComparationBuy === '+',
                               redValue: valueComparationBuy === '-'}">
                      {{ currencyValueBuy }}
                    </span>
                    <span
                      v-else
                      :class="{greenValue: valueComparationSwapPointsBuy === '+',
                               redValue: valueComparationSwapPointsBuy === '-'}">
                      <!-- eslint-disable-next-line max-len -->
                      {{ formatoPrecioCuatroDigitos(formatSwapPointsBuy) }}
                    </span>
                  </div>
                  <button
                    type="submit"
                    class="btn btn-block btn-operacion"
                    @click.prevent="eventOperation('Comprar')">
                    {{ isBuy ? 'Vender' : 'Comprar' }} {{ currencySelected }}
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="operacionSeleccionada !== 'BLOCKTRADE'"
              class="row">
              <div class="col-12">
                <div
                  v-if="!solicitarPrecio"
                  class="title-actions">
                  Selecciona una acción
                </div>
                <div
                  class="box-btn-operacion">
                  <button
                    v-if="!solicitarPrecio"
                    type="button"
                    class="btn btn-outline-operacion btn-sm"
                    :class="{ 'active': optionSelected === 'Vender' }"
                    @click="clickOption('Vender')">
                    {{ isBuy ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </button>

                  <button
                    v-if="mostrarTwoWay && !solicitarPrecio"
                    type="button"
                    class="btn btn-outline-operacion btn-sm"
                    :class="{ 'active': mostrarTwoWay == true && optionSelected === 'Twoway'}"
                    @click="clickOption('Twoway')">
                    Two Way
                  </button>

                  <button
                    v-if="!solicitarPrecio"
                    type="button"
                    class="btn btn-outline-operacion btn-sm"
                    :class="{ 'active': optionSelected === 'Comprar' }"
                    @click="clickOption('Comprar')">
                    {{ isBuy ? 'Vender' : 'Comprar' }} {{ currencySelected }}
                  </button>
                </div>
                <div
                  v-if="solicitarPrecio"
                  class="box-tiempo">
                  <div class="title-tiempo">
                    Tiempo restante para completar tu operación:
                  </div>
                  <div class="box-timer">
                    <vue-ellipse-progress
                      color="#A41D36"
                      :size="90"
                      :progress="progress">
                      <span>{{ timeLeft }}</span>
                    </vue-ellipse-progress>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="operacionSeleccionada == 'BLOCKTRADE' && solicitarPrecio"
              class="row">
              <div class="col-12">
                <div
                  v-if="operacionSeleccionada == 'BLOCKTRADE' && solicitarPrecio"
                  class="box-block-detalle mt-4">
                  <div class="box-spot-mes">
                    <details>
                      <summary>Detalle</summary>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">
                              Fecha de liquidación
                            </th>
                            <th scope="col">
                              Nocional
                            </th>
                            <th scope="col">
                              Tipo de Cambio
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(blockTradeRow, indexRow) in blockTradeRows"
                            :key="indexRow">
                            <td>{{ formatoFechaBlockTradeDetail(blockTradeRow.fechaSeleccionada) }}</td>
                            <td>{{ blockTradeRow.nocional }}</td>
                            <td
                              :class="{greenValue: blockTradeRow.priceComparation === '+',
                                       redValue: blockTradeRow.priceComparation === '-'}">
                              {{ formatoPrecioCuatroDigitos(blockTradeRow.price) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="row box-monto-detalle">
                        <div class="col-precio col-12 col-md-6">
                          <div class="monto-title">
                            Precio Promedio
                          </div>
                          <div class="monto-cantidad">
                            {{ formatoPrecioCuatroDigitos(obtenerPromedioBlockTrade()) }}
                          </div>
                        </div>
                        <div class="col-precio col-12 col-md-6">
                          <div class="monto-title">
                            Total del monto cotizado (Nocional {{ currencySelected }})
                          </div>
                          <div class="monto-cantidad">
                            {{ obtenerMontoTotal() }}
                          </div>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
                <div
                  v-if="solicitarPrecio"
                  class="box-tiempo">
                  <div class="title-tiempo">
                    Tiempo restante para completar tu operación:
                  </div>
                  <div class="box-timer">
                    <vue-ellipse-progress
                      color="#A41D36"
                      :size="90"
                      :progress="progress">
                      <span>{{ timeLeft }}</span>
                    </vue-ellipse-progress>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-show="operacionSeleccionada !== 'SWAP' && operacionSeleccionada !== 'BLOCKTRADE'"
              class="row">
              <div class="col-12 col-md-6">
                <div class="box-monto input-group">
                  <div class="group-select">
                    <div class="title-group">
                      Divisa
                    </div>
                    <select
                      name="select"
                      class="select-precio"
                      :disabled="solicitarPrecio"
                      @change="setCurrencySelected($event)">
                      <option
                        v-for="(currency, index) in currenciesSelected"
                        :id="index"
                        :key="index"
                        :selected="currencySelected === currency"
                        :value="currency">
                        {{ currency }}
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div class="title-group">
                      Monto <span class="hidden-xs"> en {{ currencySelected }} </span>
                    </div>
                    <currency-input
                      id="currencyInput"
                      ref="dataInput"
                      class="form-control input-precio"
                      :value="monto"
                      :disabled="solicitarPrecio"
                      :options="currencyOptions"
                      @change="monto = $event" />
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="box-liquidacion input-group">
                  <div class="group-select">
                    <div class="title-group title-fecha">
                      Fecha de liquidación
                    </div>
                    <select
                      id="fecha-calendario"
                      name="select"
                      class="select-fecha"
                      :disabled="solicitarPrecio"
                      @change="setCalendar($event)">
                      <option
                        v-for="(calendarOp, index) in calendarOptions"
                        :id="index"
                        :key="index"
                        :data-tipo="calendarOp.Description"
                        :selected="calendarSelected === calendarOp.date"
                        :value="calendarOp.date">
                        {{ calendarOp.Description }}
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div
                      class="wrapp-fecha">
                      <date-picker
                        :min-date="new Date()"
                        :disabled-dates="{ weekdays: [1, 7] }"
                        :masks="masks"
                        :model-config="modelConfig"
                        :value="dateCalendar()"
                        :popover="{ visibility: 'click' }"
                        @dayclick="onDayClick">
                        <template #default="{ inputValue, inputEvents }">
                          <input
                            class="form-control input-fecha"
                            :value="inputValue"
                            :disabled="operacionSeleccionada === 'SPOT' || solicitarPrecio"
                            v-on="inputEvents">
                        </template>
                      </date-picker>
                    </div>
                    <i class="icon-calendar">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 13.5H13C12.45 13.5 12 13.95 12 14.5V17.5C12 18.05 12.45 18.5 13 18.5H16C16.55 18.5 17 18.05 17 17.5V14.5C17 13.95 16.55 13.5 16 13.5ZM16 3.5V4.5H8V3.5C8 2.95 7.55 2.5 7 2.5C6.45 2.5 6 2.95 6 3.5V4.5H5C3.89 4.5 3.01 5.4 3.01 6.5L3 20.5C3 21.6 3.89 22.5 5 22.5H19C20.1 22.5 21 21.6 21 20.5V6.5C21 5.4 20.1 4.5 19 4.5H18V3.5C18 2.95 17.55 2.5 17 2.5C16.45 2.5 16 2.95 16 3.5ZM18 20.5H6C5.45 20.5 5 20.05 5 19.5V9.5H19V19.5C19 20.05 18.55 20.5 18 20.5Z"
                          fill="#424242" />
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="operacionSeleccionada === 'SWAP'"
              class="row">
              <div class="col-12 col-md-12 marginPata">
                <p>Pata corta</p>
              </div>
              <div class="col-12 col-md-6">
                <div class="box-monto input-group">
                  <div class="group-select">
                    <div class="title-group">
                      Divisa
                    </div>
                    <select
                      name="select"
                      class="select-precio"
                      :disabled="solicitarPrecio"
                      @change="setCurrencySelected($event)">
                      <option
                        v-for="(currency, index) in currenciesSelected"
                        :id="index"
                        :key="index"
                        :selected="currencySelected === currency"
                        :value="currency">
                        {{ currency }}
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div class="title-group">
                      Monto en <span class="hidden-xs"> en {{ currencySelected }} </span>
                    </div>
                    <currency-input
                      id="currencyInput"
                      class="form-control input-precio"
                      :value="montoPataCorta"
                      :disabled="solicitarPrecio"
                      :options="currencyOptions"
                      @change="montoPataCorta = $event" />
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="box-liquidacion input-group">
                  <div class="group-select">
                    <div class="title-group title-fecha">
                      Fecha de liquidación
                    </div>
                    <select
                      id="fecha-calendario"
                      name="select"
                      class="select-fecha"
                      :disabled="solicitarPrecio"
                      @change="setCalendarPataCorta($event)">
                      <option
                        v-for="(calendarOp, index) in calendarOptionsPataCorta"
                        :id="index"
                        :key="index"
                        :data-tipo="calendarOp.Description"
                        :selected="calendarTipoPataCorta === calendarOp.date"
                        :value="calendarOp.date">
                        {{ calendarOp.Description }}
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div
                      class="wrapp-fecha">
                      <date-picker
                        :min-date="new Date()"
                        :disabled-dates="{ weekdays: [1, 7] }"
                        :masks="masks"
                        :model-config="modelConfig"
                        :value="dateCalendarPataCorta()"
                        :popover="{ visibility: 'click' }"
                        @dayclick="onDayClickPataCorta">
                        <template #default="{ inputValue, inputEvents }">
                          <input
                            class="form-control input-fecha"
                            :value="inputValue"
                            :disabled="operacionSeleccionada === 'SPOT' || solicitarPrecio"
                            v-on="inputEvents">
                        </template>
                      </date-picker>
                    </div>
                    <i class="icon-calendar">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 13.5H13C12.45 13.5 12 13.95 12 14.5V17.5C12 18.05 12.45 18.5 13 18.5H16C16.55 18.5 17 18.05 17 17.5V14.5C17 13.95 16.55 13.5 16 13.5ZM16 3.5V4.5H8V3.5C8 2.95 7.55 2.5 7 2.5C6.45 2.5 6 2.95 6 3.5V4.5H5C3.89 4.5 3.01 5.4 3.01 6.5L3 20.5C3 21.6 3.89 22.5 5 22.5H19C20.1 22.5 21 21.6 21 20.5V6.5C21 5.4 20.1 4.5 19 4.5H18V3.5C18 2.95 17.55 2.5 17 2.5C16.45 2.5 16 2.95 16 3.5ZM18 20.5H6C5.45 20.5 5 20.05 5 19.5V9.5H19V19.5C19 20.05 18.55 20.5 18 20.5Z"
                          fill="#424242" />
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="operacionSeleccionada === 'SWAP'"
              class="row">
              <div class="col-12 col-md-12 marginPata">
                <p>Pata larga</p>
              </div>
              <div class="col-12 col-md-6">
                <div class="box-monto input-group">
                  <div class="group-select">
                    <div class="title-group">
                      Divisa
                    </div>
                    <select
                      name="select"
                      class="select-precio"
                      :disabled="solicitarPrecio"
                      @change="setCurrencySelected($event)">
                      <option
                        v-for="(currency, index) in currenciesSelected"
                        :id="index"
                        :key="index"
                        :selected="currencySelected === currency"
                        :value="currency">
                        {{ currency }}
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div class="title-group">
                      Monto en <span class="hidden-xs"> en {{ currencySelected }} </span>
                    </div>
                    <currency-input
                      id="currencyInput"
                      class="form-control input-precio"
                      :value="montoPataLarga"
                      :disabled="solicitarPrecio"
                      :options="currencyOptions"
                      @change="montoPataLarga = $event" />
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="box-liquidacion input-group">
                  <div class="group-select">
                    <div class="title-group title-fecha">
                      Fecha de liquidación
                    </div>
                    <select
                      id="fecha-calendario"
                      name="select"
                      class="select-fecha"
                      :disabled="solicitarPrecio"
                      @change="setCalendarPataLarga($event)">
                      <option
                        v-for="(calendarOp, index) in calendarOptionsPataLarga"
                        :id="index"
                        :key="index"
                        :data-tipo="calendarOp.Description"
                        :selected="calendarTipoPataLarga === calendarOp.date"
                        :value="calendarOp.date">
                        {{ calendarOp.Description }}
                      </option>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <div
                      class="wrapp-fecha">
                      <date-picker
                        :min-date="new Date()"
                        :disabled-dates="{ weekdays: [1, 7] }"
                        :masks="masks"
                        :model-config="modelConfig"
                        :class="{'redValue': !fechaSwapValida}"
                        :value="dateCalendarPataLarga()"
                        :popover="{ visibility: 'click' }"
                        @dayclick="onDayClickPataLarga">
                        <template #default="{ inputValue, inputEvents }">
                          <input
                            class="form-control input-fecha"
                            :class="{'redValue': !fechaSwapValida}"
                            :value="inputValue"
                            :disabled="operacionSeleccionada === 'SPOT' || solicitarPrecio"
                            v-on="inputEvents">
                        </template>
                      </date-picker>
                    </div>
                    <i class="icon-calendar">
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M16 13.5H13C12.45 13.5 12 13.95 12 14.5V17.5C12 18.05 12.45 18.5 13 18.5H16C16.55 18.5 17 18.05 17 17.5V14.5C17 13.95 16.55 13.5 16 13.5ZM16 3.5V4.5H8V3.5C8 2.95 7.55 2.5 7 2.5C6.45 2.5 6 2.95 6 3.5V4.5H5C3.89 4.5 3.01 5.4 3.01 6.5L3 20.5C3 21.6 3.89 22.5 5 22.5H19C20.1 22.5 21 21.6 21 20.5V6.5C21 5.4 20.1 4.5 19 4.5H18V3.5C18 2.95 17.55 2.5 17 2.5C16.45 2.5 16 2.95 16 3.5ZM18 20.5H6C5.45 20.5 5 20.05 5 19.5V9.5H19V19.5C19 20.05 18.55 20.5 18 20.5Z"
                          fill="#424242" />
                      </svg>
                    </i>
                  </div>
                </div>
              </div>
            </div>
            <div class="row box-two-btn d-flex justify-content-around">
              <button
                type="button"
                class="btn btn-outline-primary btn-cancelar"
                @click="cancelClick()">
                Cancelar
              </button>
              <button
                type="button"
                :disabled="deshabilitarBotonSubmit()"
                class="btn btn-primary btn-solicita"
                @click="onSubmit()">
                {{ solicitarPrecio ? 'Modificar' : 'Solicitar Precio' }}
              </button>
            </div>
          </form>
        </div>
        <sidebar />
      </div>
    </div>
    <modal-exitoso
      v-if="showModal"
      :open="showModal"
      :show-close-button="false"
      @close="handleClose" />
    <modal-error
      v-if="showModalError"
      :open="showModalError"
      @close="handleCloseError" />
    <modal-horario
      v-if="showModalHorario"
      :open="showModalHorario"
      @close="handleCloseHorario" />
    <modal-tiempo
      v-if="showModalTiempo"
      :open="showModalTiempo"
      @close="handleCloseTiempo" />
    <custom-modal
      v-if="customModalProps.open"
      :open="customModalProps.open"
      :type="customModalProps.type"
      :title="customModalProps.title"
      :message="customModalProps.message"
      :btn-accept-text="customModalProps.btnAcceptText"
      :btn-close-text="customModalProps.btnCancelText"
      :btn-accept-func="customModalProps.btnAcceptFunc"
      :btn-close-func="customModalProps.btnCancelFunc"
      :btn-close-hide="customModalProps.btnCloseHide"
      @close="closeModal" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueEllipseProgress } from 'vue-ellipse-progress';
import moment from 'moment-timezone';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import CustomModal from './CustomModal.vue';
import CurrencyInput from './CurrencyInput.vue';
import Sidebar from './Sidebar.vue';
import ModalExitoso from './ModalExitoso.vue';
import ModalError from './ModalError.vue';
import ModalTiempo from './ModaTiempo.vue';
import ModalHorario from './ModalHorario.vue';
import liquidParser from '../liquid/liquidParser';
import Repository from '../repositories/RepositoryFactory';

const InvexRepository = Repository.get('invex');
const segundoPeticiones = liquidParser.parse('{{ vars.segundopeticiones }}');
const ENVIROMENT = liquidParser.parse('{{ vars.enviroment }}');
const urlParams = new URLSearchParams(window.location.search);
/* const fechasForwardValidasCambios = [
  'TODAY',
  'TOMORROW',
  'SPOTNEXT',
  '4 DAYS',
  '4D',
]; */

export default {
  name: 'OperacionesFx',
  components: {
    CurrencyInput,
    VueEllipseProgress,
    Sidebar,
    ModalExitoso,
    ModalError,
    ModalTiempo,
    ModalHorario,
    CustomModal,
    DatePicker,
  },
  data() {
    return {
      isFromCalendar: false,
      dataTwoWay: null,
      progress: 100,
      timeLeft: '00:60',
      segundosTimmer: 59,
      solicitarPrecio: false,
      // operacionSeleccionada: 'SPOT',
      operacion: 'SPOT',
      operationsSelected: 'SPOT',
      isTwoway: null,
      // mostrarTwoWay: false,
      optionSelected: 'Comprar',
      monto: 0,
      montoPataCorta: 0,
      montoPataLarga: 0,
      timmerId: null,
      currencySelected: '',
      currenciesOptions: [],
      operationsOptions: [{
        productCode: 'SPOT',
        productDescription: 'SPOT',
      }],
      currenciesSelected: [],
      calendarOptions: [],
      calendarOptionsPataCorta: [],
      calendarOptionsPataLarga: [],
      calendarSelected: null,
      calendarActive: false,
      calendarTipoSelected: null,
      calendarTipoPataCorta: null,
      calendarTipoPataLarga: null,
      calendarFechaPataCorta: null,
      calendarFechaPataLarga: null,
      currencySelectedId: 1,
      showModal: false,
      showModalError: false,
      showModalTiempo: false,
      showModalHorario: false,
      isDisabled: true,
      // loading: true,
      currencyValueBuy: '',
      currencyValueSell: '',
      currencySwapPointsSell: '',
      currencySwapPointsBuy: '',
      valueComparationBuy: '',
      valueComparationSell: '',
      valueComparationSwapPointsSell: '',
      valueComparationSwapPointsBuy: '',
      isBuy: false,
      wsAccount: 'INVEXCOMP.TEST',
      // qrCLOrdID: 'INVEXCOMP.TEST-00020220209124801190',
      orderType: 'Previously',
      qPrice: 20.9294,
      fechaSwapValida: true,
      qQuoteID: '',
      qQuoteReqID: '',
      opSide: 'Buy',
      customModalProps: {
        title: 'La fecha de liquidación corresponde a un Derivado',
        message: '¿Deseas continuar con la operación?',
        type: 'warning',
        open: false,
        btnAcceptText: 'Aceptar',
        btnCancelText: 'Cancelar',
        btnCloseHide: false,
      },
      masks: {
        input: 'DD-MM-YYYY',
        // input: 'YYYY-MM-DD',
      },
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD',
      },
      tkn: '',
      tenorPataCorta: 'TODAY',
      tenorPataLarga: 'TOMORROW',
      customDate: '2022-06-07',
      blockTradeRows: [{
        fechaSeleccionada: '',
        nocional: '0',
        compra: true,
        calendarOptions: [],
      }],
      checkedInstrucion: false,
      currencyOptions: {
        currency: 'USD',
        currencyDisplay: 'hidden',
        locale: 'en-US',
        precision: 2,
        valueRange: { min: 0 },
        hideCurrencySymbolOnFocus: true,
      },
      destinoCurrency: '',
      allListadoDestino: [],
      listadoOrigen: [],
      listadoDestino: [],
      origenSelected: null,
      destinoSelected: null,
      cuentaOrigen: null,
      cuentaDestino: null,
      fechaBloqueMax: null,
      blockTradeSide: '1',
      renderFirstTime: true,
      renderFirstTimeOperations: true,
      cancelClickFirst: false,
      banderaDerivados: false,
      parametrosDerivados: [],
      esDerivado: false,
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapState(['currentView']),
    ...mapState(['mapClientLogeo']),
    ...mapState(['servicio']),
    ...mapState(['listarOperacion']),
    ...mapState(['listaOperaciones']),
    ...mapState(['listaOrigen']),
    ...mapState(['listaDestino']),
    ...mapState(['horario']),
    ...mapState(['recuperaFecha']),
    ...mapState(['userData']),
    ...mapState([
      'listaDivisas',
      'calendario',
      'quoteRequest',
      'operacionSeleccionada',
      'pataCortapataLarga',
    ]),
    mostrarTwoWay() {
      return this.isTwoway;
      // return this.$store.state.mapClientLogeo.twoWay;
    },
    tipoFechaPataCorta() {
      const tipoFechaSelecPataCorta = this.calendario.find((item) => item.date === this.calendarTipoPataCorta);
      if (!tipoFechaSelecPataCorta) return '';
      return tipoFechaSelecPataCorta.Description;
    },
    tipoFechaPataLarga() {
      const tipoFechaSelecPataLarga = this.calendario.find((item) => item.date === this.calendarTipoPataLarga);
      if (!tipoFechaSelecPataLarga) return '';
      return tipoFechaSelecPataLarga.Description;
    },
    tipoFecha() {
      if (this.calendarSelected === '') {
        this.deshabilitarBotonSubmit();
      }
      const tipoFechaSeleccionada = this.calendario.find((item) => item.date === this.calendarSelected);
      if (!tipoFechaSeleccionada) return '';
      return tipoFechaSeleccionada.Description;
    },
    datoFecha() {
      const datoFechaSeleccionada = this.calendario.find((item) => item.date === this.calendarSelected);
      if (!datoFechaSeleccionada) return '';
      return datoFechaSeleccionada.date;
    },
    datoFechaSpot() {
      const datoFechaSeleccionada = this.calendarOptions.find((item) => item.Description === 'SPOT');
      if (!datoFechaSeleccionada) return '';
      return datoFechaSeleccionada.date;
    },
    datoFechaToday() {
      const datoFechaSeleccionada = this.calendario.find((item) => item.Description === 'TODAY');
      if (!datoFechaSeleccionada) return '';
      return datoFechaSeleccionada.date;
    },
    datoFechaTomorrow() {
      const datoFechaSeleccionada = this.calendario.find((item) => item.Description === 'TOMORROW');
      if (!datoFechaSeleccionada) return '';
      return datoFechaSeleccionada.date;
    },
    fechaFormat() {
      if (!this.calendarSelected) return '';
      const dateArr = this.calendarSelected.split('-');
      return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    },
    formatSwapPointsSell() {
      const swapPointsSell = this.currencySwapPointsSell;
      return Math.floor(swapPointsSell * 10000) / 10000;
    },
    formatSwapPointsBuy() {
      const swapPointsBuy = this.currencySwapPointsBuy;
      return Math.floor(swapPointsBuy * 10000) / 10000;
    },
    validaLei() {
      return this.parametrosDerivados.codigoLei !== null;
    },
  },
  async mounted() {
    // Se puede comentar esta parte para temas de desarrollo
    if (ENVIROMENT === 'production') {
      await this.validateSession();
    } else {
      this.dataTwoWay = false;
      const userDefault = {
        data: {
          user360T: 'INVEXCOMP1.TEST',
          internetFolio: '9254',
          CUI: '00006710',
          idGlobal: 0,
        },
      };
      await this.$store.dispatch('setUserData', JSON.stringify(userDefault));
    }
    // Fin de lo que se puede comentar para temas de desarrollo
    if (urlParams.has('bill')) {
      await this.$store.dispatch('setLocalStorage');
    }
    Promise.all([
      this.getCurrencies(),
      this.getOperations(),
      this.getHoraRestriccion(),
    ]);
    this.getValueTwoWay();
    // await this.$store.dispatch('generarTokenSeguridad', {
    //   CUI: this.mapClientLogeo.CUI,
    //   internetFolio: this.mapClientLogeo.internetFolio,
    // });
  },
  async created() {
    const getHours = new Date().getHours();
    if (getHours >= 9 && getHours < 18) {
      if (getHours === 16) {
        this.showModalHorario = true;
      }
    }
    await this.$store.dispatch('updateListarOperaciones');
  },
  methods: {
    add() {
      this.calendarOptions.unshift({
        DateValue: '', Description: '',
      });
    },
    remove() {
      this.calendarOptions = this.calendarOptions.filter((item) => item.Description);
    },
    addPataCorta() {
      this.calendarOptionsPataCorta.unshift({
        DateValue: '', Description: '',
      });
    },
    removePataCorta() {
      this.calendarOptionsPataCorta = this.calendarOptionsPataCorta.filter((item) => item.Description);
    },
    addPataLarga() {
      this.calendarOptionsPataLarga.unshift({
        DateValue: '', Description: '',
      });
    },
    removePataLarga() {
      this.calendarOptionsPataLarga = this.calendarOptionsPataLarga.filter((item) => item.Description);
    },
    onDayClick(ev) {
      this.calendarActive = true;
      const fechaCal = ev.id;
      this.calendarSelected = fechaCal;
      const dataSpot = this.datoFechaSpot;
      const emptyCalendarOption = this.calendarOptions.find((item) => item.Description === '');
      if (fechaCal === dataSpot) {
        this.seleccionarOperacion({ target: { value: 'SPOT' } });
      } else if (!emptyCalendarOption) {
        this.add();
      }
    },
    async onDayClickPataCorta(ev) {
      this.calendarActive = true;
      const fechaCal = ev.id;
      this.calendarTipoPataCorta = fechaCal;
      this.isFromCalendar = true;
      const emptyCalendarOptions = this.calendarOptionsPataCorta.find((item) => item.Description === '');
      if (!emptyCalendarOptions) {
        this.addPataCorta();
      }
      // this.calendarOptionsPataCorta = this.calendario;
      this.condicionFechasSwap();
      if (this.fechaSwapValida) {
        this.getpataCortapataLarga();
      }
    },
    async onDayClickPataLarga(ev) {
      this.calendarActive = true;
      const fechaCal = ev.id;
      this.calendarTipoPataLarga = fechaCal;
      const emptyCalendarOptions = this.calendarOptionsPataLarga.find((item) => item.Description === '');
      if (!emptyCalendarOptions) {
        this.addPataLarga();
      }
      this.condicionFechasSwap();
    },
    onDayClickBlockTrade(ind, ev) {
      this.blockTradeRows[ind].fechaSeleccionada = ev.id;
      const emptyCalendarOption = this.blockTradeRows[ind].calendarOptions.find((item) => item.Description === '');
      const hasTenor = this.blockTradeRows[ind].calendarOptions.find((item) => item.date === ev.id);
      if (hasTenor) {
        if (emptyCalendarOption) {
          // eslint-disable-next-line max-len
          this.blockTradeRows[ind].calendarOptions = this.blockTradeRows[ind].calendarOptions.filter((blockTradeRow) => blockTradeRow.Description);
        }
      } else if (!emptyCalendarOption) {
        this.blockTradeRows[ind].calendarOptions.unshift({
          DateValue: '', Description: '',
        });
      }
    },
    validateBlockTradeRows() {
      let notionalValid = true;
      let datesValid = true;
      this.blockTradeRows.forEach((blockTradeRow) => {
        if (!blockTradeRow.nocional || blockTradeRow.nocional === 0) notionalValid = false;
        if (!blockTradeRow.fechaSeleccionada) datesValid = false;
      });
      return notionalValid && datesValid;
    },
    deshabilitarBotonSubmit() {
      const horarioStatus = this.horario ? this.horario.status : '';
      if (this.calendarOptions.length === 0 || horarioStatus === 'offline' || !this.fechaSwapValida) return true;
      if (this.operacionSeleccionada === 'SWAP') {
        return this.montoPataCorta === 0 || this.montoPataCorta === '0' || this.montoPataCorta === null || this.montoPataLarga === 0 || this.montoPataLarga === '0' || this.montoPataLarga === null;
      }
      if (this.operacionSeleccionada === 'BLOCKTRADE') return !this.validateBlockTradeRows();
      if (this.calendarSelected === '') return true;
      return this.monto === 0 || this.monto === '0' || this.monto === null;
    },
    closeModal() {
      this.customModalProps.open = false;
    },
    enterForm() {
      // console.log('enterForm');
    },
    getValueTwoWay() {
      if (this.mostrarTwoWay) {
        this.optionSelected = 'Twoway';
      } else {
        // alert('false');
      }
    },
    async onSumbitOperacion() {
      try {
        const getHours = new Date().getHours();
        if (getHours >= 9 && getHours < 18) {
          if (getHours === 16) {
            // alert('Servicio temporalmente fuera de servicio, intentar a las 5pm por favor');
          } else {
            // alert('Aceptado');
          }
        } else {
          // alert('Fuera de horario');
        }
        const opSide = this.optionSelected === 'Comprar' ? 'Buy' : 'Sell';
        // if (this.isBuy) {
        //   opSide = this.optionSelected === 'Comprar' ? 'Sell' : 'Buy';
        // }
        this.valueComparationSell = '';
        this.valueComparationBuy = '';
        this.valueComparationSwapPointsSell = '';
        this.valueComparationSwapPointsBuy = '';
        this.opSide = opSide;
        const currenciesSelected = this.currenciesSelected.join('/');
        const tomorrow = this.calendarSelected.replace(/-/g, '');
        const pataCorta = this.calendarTipoPataCorta ? this.calendarTipoPataCorta.replace(/-/g, '') : '';
        const pataLarga = this.calendarTipoPataLarga ? this.calendarTipoPataLarga.replace(/-/g, '') : '';
        const sideValue = this.optionSelected === 'Twoway' ? 'Twoway' : opSide;
        const monto = this.operacionSeleccionada === 'SWAP' ? this.montoPataCorta : this.monto;
        const dateBody = this.operacionSeleccionada === 'SWAP' ? pataCorta : tomorrow;
        const body = {
          ProductType: 'FX_STD',
          NoRelatedSym: [{
            Symbol: currenciesSelected,
            Side: sideValue,
            OrderQty: monto.toString(),
            SettlDate: dateBody,
            OrderQty2: this.operacionSeleccionada === 'SWAP' ? this.montoPataLarga : null,
            SettlDate2: this.operacionSeleccionada === 'SWAP' ? pataLarga : null,
            Currency: this.currencySelected,
            Account: this.userData.data.user360T,
            OperationName: this.operacionSeleccionada,
          }],
        };
        this.$store.dispatch('setLoading', true);
        const quoteRequest = await InvexRepository.getQuoteRequest(body);
        this.$store.dispatch('setLoading', false);
        // eslint-disable-next-line no-console
        console.log('se consumio el quote request', new Date());
        const rspMsg = JSON.parse(quoteRequest.Message);
        this.$store.dispatch('setQuoteRequest', rspMsg);
        this.currencyValueSell = rspMsg.SellPrice;
        this.currencyValueBuy = rspMsg.BuyPrice;
        this.currencySwapPointsSell = rspMsg.SwapPointsSell;
        this.currencySwapPointsBuy = rspMsg.SwapPointsBuy;
        this.qQuoteID = rspMsg.QuoteID;
        this.qQuoteReqID = rspMsg.QuoteReqID;
        this.solicitarPrecio = true;
        this.startTimer();
      } catch (err) {
        this.customModalProps.open = true;
        this.customModalProps.title = 'Error en su solicitud';
        this.customModalProps.message = 'Intente de nuevo';
        this.customModalProps.type = 'warning';
        this.customModalProps.btnAcceptText = 'Aceptar';
        this.customModalProps.btnCloseHide = true;
        this.customModalProps.btnAcceptFunc = this.closeModal;
      }
    },
    async onSubmitBlockTrade() {
      try {
        const Symbol = this.currenciesSelected.join('/');
        let totalCompra = 0;
        let totalVenta = 0;
        const NoLegs = this.blockTradeRows.map((blockTradeRow) => {
          if (blockTradeRow.compra) {
            totalCompra += blockTradeRow.nocional;
          } else {
            totalVenta += blockTradeRow.nocional;
          }
          const LegSettlDate = blockTradeRow.fechaSeleccionada.replace(/-/g, '');
          return {
            LegSymbol: Symbol,
            LegSide: blockTradeRow.compra ? '1' : '2',
            LegQty: blockTradeRow.nocional,
            NoLegAllocs: '1',
            LegAllocAccount: this.userData.data.user360T,
            LegAllocQty: blockTradeRow.nocional,
            LegSettlDate,
          };
        });
        const Side = totalCompra >= totalVenta ? '1' : '2';
        this.blockTradeSide = Side;
        const body = {
          ProductType: 'FX_BT',
          NoRelatedSym: [{
            Symbol,
            Side,
            OrderQty: '0',
            Currency: this.currencySelected,
            Account: this.userData.data.user360T,
            ExpireTime: '300',
            OperationName: 'BLOCKTRADE',
          }],
          NoLegsV: this.blockTradeRows.length,
          NoLegs,
        };
        this.$store.dispatch('setLoading', true);
        const quoteRequest = await InvexRepository.getQuoteRequestBlockTrade(body);
        this.$store.dispatch('setLoading', false);
        // eslint-disable-next-line no-console
        console.log('se consumio el quote request', new Date());
        if (quoteRequest.data && quoteRequest.data.DataIdentifier) {
          this.qQuoteID = quoteRequest.data.message.QuoteID;
          this.qQuoteReqID = quoteRequest.data.message.QuoteReqID;
          this.setNewBlockTradeRowsValues(quoteRequest.data.message);
          this.segundosTimmer = 299;
          this.solicitarPrecio = true;
          this.startTimer();
        } else {
          throw new Error('Error en su solicitud');
        }
      } catch (e) {
        this.$store.dispatch('setLoading', false);
        this.customModalProps.open = true;
        this.customModalProps.title = 'Error en su solicitud';
        this.customModalProps.message = 'Intente de nuevo';
        this.customModalProps.type = 'warning';
        this.customModalProps.btnAcceptText = 'Aceptar';
        this.customModalProps.btnCloseHide = true;
        this.customModalProps.btnAcceptFunc = this.closeModal;
      }
    },
    async onSubmit() {
      if (this.solicitarPrecio) {
        this.solicitarPrecio = false;
        clearInterval(this.timmerId);
      } else {
        this.segundosTimmer = 59;
        this.$store.dispatch('setLoading', true);
        switch (this.operacionSeleccionada) {
          case 'SPOT':
            this.$store.dispatch('setLoading', false);
            await this.onSumbitOperacion();
            break;
          case 'SWAP':
            this.segundosTimmer = 119;
            try {
              await this.obtenerDerivados(this.calendarTipoPataCorta);
              this.$store.dispatch('setLoading', false);
            } catch (err) {
              this.$store.dispatch('setLoading', false);
            }
            if (this.esDerivado) {
              this.customModalProps.open = true;
              this.customModalProps.title = 'La fecha de liquidación corresponde a un Derivado';
              this.customModalProps.message = '¿Deseas continuar con la operación?';
              this.customModalProps.type = 'warning';
              this.customModalProps.btnAcceptText = 'Aceptar';
              this.customModalProps.btnCancelText = 'Cancelar';
              this.customModalProps.btnCloseHide = false;
              this.customModalProps.btnCancelFunc = this.closeModal;
              this.customModalProps.btnAcceptFunc = this.validarBanderaDerivados;
            } else {
              await this.onSumbitOperacion();
            }
            break;
          case 'FORWARD':
            await this.obtenerDerivados();
            this.$store.dispatch('setLoading', false);
            if (this.esDerivado) {
              this.customModalProps.open = true;
              this.customModalProps.title = 'La fecha de liquidación corresponde a un Derivado';
              this.customModalProps.message = '¿Deseas continuar con la operación?';
              this.customModalProps.type = 'warning';
              this.customModalProps.btnAcceptText = 'Aceptar';
              this.customModalProps.btnCancelText = 'Cancelar';
              this.customModalProps.btnCloseHide = false;
              this.customModalProps.btnCancelFunc = this.closeModal;
              this.customModalProps.btnAcceptFunc = this.validarBanderaDerivados;
            } else {
              await this.onSumbitOperacion();
            }
            break;
          case 'BLOCKTRADE':
            this.fechaTrade();
            await this.obtenerDerivados(this.fechaBloqueMax);
            this.$store.dispatch('setLoading', false);
            if (this.esDerivado) {
              this.customModalProps.open = true;
              this.customModalProps.title = 'La fecha de liquidación corresponde a un Derivado';
              this.customModalProps.message = '¿Deseas continuar con la operación?';
              this.customModalProps.type = 'warning';
              this.customModalProps.btnAcceptText = 'Aceptar';
              this.customModalProps.btnCancelText = 'Cancelar';
              this.customModalProps.btnCloseHide = false;
              this.customModalProps.btnCancelFunc = this.closeModal;
              this.customModalProps.btnAcceptFunc = this.validarBanderaDerivados;
            } else {
              await this.onSubmitBlockTrade();
            }
            break;
          default:
            this.$store.dispatch('setLoading', false);
            await this.onSumbitOperacion();
            break;
        }
      }
    },
    async getOperations() {
      try {
        await this.$store.dispatch('getListaOperaciones');
        if (urlParams.has('operation') && this.renderFirstTimeOperations) {
          const operationParams = urlParams.get('operation').toUpperCase();
          if (this.listarOperacion.find((operation) => operation.productCode === operationParams)) {
            this.renderFirstTimeOperations = false;
            this.seleccionarOperacion({ target: { value: operationParams } });
          }
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getCurrencies() {
      try {
        await this.$store.dispatch('getDivisas');
        this.currenciesOptions = this.listaDivisas;
        let findCurrency = this.currenciesOptions.findIndex((item) => item.Ccy1 === 'USD' && item.Ccy2 === 'MXN');
        if (urlParams.has('currencies') && this.renderFirstTime) {
          const currenciesParams = urlParams.get('currencies').toUpperCase();
          findCurrency = this.currenciesOptions.findIndex((currency) => `${currency.Ccy1.toUpperCase()}${currency.Ccy2.toUpperCase()}` === currenciesParams);
          this.renderFirstTime = false;
          this.cancelClickFirst = true;
        }
        await this.setCurrenciesOptions({ target: { value: findCurrency > -1 ? findCurrency : 0 } });
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getHoraRestriccion() {
      try {
        await this.$store.dispatch('updateHorario');
        const valorActual = this.$store.state.horario.status;
        if (valorActual === 'offline') {
          this.showModalHorario = true;
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getRecuperaFecha() {
      const bodyFecha = {
        fecha: this.calendarSelected,
      };
      try {
        await this.$store.dispatch('recuperaFecha', bodyFecha);
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getRecuperaFechaBloque() {
      const bodyFecha = {
        fecha: this.fechaBloqueMax,
      };
      try {
        await this.$store.dispatch('recuperaFecha', bodyFecha);
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getCalendar() {
      try {
        const currenciesSelected = this.currenciesSelected.join('/');
        this.$store.dispatch('setLoading', true);
        await this.$store.dispatch('getCalendario', currenciesSelected, this.userData.data.user360T);
        this.calendarOptions = this.calendario;
        this.calendarOptionsPataCorta = this.calendario;
        this.calendarOptionsPataLarga = this.calendario;
        const spot = JSON.parse(JSON.stringify(this.calendario)).find((item) => item.Description === 'SPOT');
        if (spot) {
          this.calendarSelected = spot.date;
        } else if (this.calendarOptions.length > 0) {
          this.calendarSelected = this.calendarOptions[0].date;
        }
        if (this.operacionSeleccionada === 'FORWARD') {
          this.calendarSelected = this.calendarOptions[0].date;
        }
        if (this.operacionSeleccionada === 'SWAP') {
          this.calendarTipoPataCorta = this.calendarOptions[0].date;
          this.calendarTipoPataLarga = this.calendarOptions[1].date;
        }
        if (this.operacionSeleccionada === 'BLOCKTRADE') {
          this.blockTradeRows[0].calendarOptions = [...this.calendarOptions];
          this.blockTradeRows[0].fechaSeleccionada = this.calendarOptions[0].date;
        }
        this.$store.dispatch('setLoading', false);
      } catch (error) {
        this.showModalError = true;
        this.$store.dispatch('setLoading', false);
      }
    },
    async getpataCortapataLarga() {
      let bodyPataCortaPataLarga = null;
      if (this.calendarTipoPataCorta && this.isFromCalendar) {
        const arrayDate = this.calendarTipoPataCorta.split('-');
        bodyPataCortaPataLarga = {
          tenor1: '',
          tenor2: this.tenorPataLarga,
          fechaIPC: `${arrayDate[2]}-${arrayDate[1]}-${arrayDate[0]}`,
          fechaIPL: '',
        };
      } else {
        bodyPataCortaPataLarga = {
          tenor1: this.tenorPataCorta,
          tenor2: this.tenorPataLarga,
          fechaIPC: '',
          fechaIPL: '',
        };
      }
      try {
        const dataResponse = await this.$store.dispatch('fechapataCortapataLarga', bodyPataCortaPataLarga);
        this.validateDate(dataResponse);
      } catch (error) {
        this.showModalError = true;
      }
    },
    validateDate(response) {
      if (response.status === 'OK') {
        const pataLargaResponse = response.data.fechaPL;
        this.findDateAndReplace(pataLargaResponse);
        this.calendarOptionsPataLarga = this.calendarOptionsPataLarga.map((item) => {
          const itemValue = JSON.parse(JSON.stringify(item));
          if (itemValue.Description === this.tenorPataLarga) {
            itemValue.date = pataLargaResponse;
            itemValue.Description = response.data.PataLarga;
            this.calendarTipoPataLarga = pataLargaResponse;
          }
          this.condicionFechasSwap();
          return itemValue;
        });
      } else {
        this.showModalError = true;
      }
    },
    findDateAndReplace(dateToReplace) {
      this.calendarOptionsPataLarga = this.calendarOptionsPataLarga.map((item) => {
        const itemValue = JSON.parse(JSON.stringify(item));
        if (itemValue.date === dateToReplace) {
          itemValue.date = this.customDate;
        }
        return itemValue;
      });
    },
    setMonto(ev) {
      this.monto = ev;
    },
    setMontoPataCorta(ev) {
      this.montoPataCorta = ev;
    },
    setMontoPataLarga(ev) {
      this.montoPataLarga = ev;
    },
    async setCurrenciesOptions(ev) {
      if (this.currenciesOptions.length > ev.target.value) {
        const auxSelected = this.currenciesOptions[ev.target.value];
        this.currencySelectedId = ev.target.value;
        this.currenciesSelected = [auxSelected.Ccy1, auxSelected.Ccy2];
        this.currencySelected = auxSelected.Ccy1;
        this.isBuy = false;
        if (!urlParams.has('currencies') || !this.renderFirstTime) {
          await this.getCalendar();
        }
      }
    },
    seleccionarOperacion(ev) {
      this.fechaSwapValida = true;
      this.$store.dispatch('updateOperacionSeleccionada', ev.target.value);
      this.blockTradeRows = [{
        fechaSeleccionada: this.calendarOptions[0].date,
        nocional: '0',
        compra: true,
        calendarOptions: [...this.calendarOptions],
      }];
      // this.operacion = ev.target.value;
      if (this.operacionSeleccionada === 'SPOT') {
        this.calendarSelected = this.datoFechaSpot;
        if (this.calendarActive === true) {
          this.remove();
        }
      } else if (this.operacionSeleccionada === 'FORWARD') {
        this.calendarSelected = this.datoFechaToday;
      } else if (this.operacionSeleccionada === 'SWAP') {
        this.removePataCorta();
        this.removePataLarga();
        this.calendarTipoPataCorta = this.datoFechaToday;
        this.calendarTipoPataLarga = this.datoFechaTomorrow;
      } else if (this.operacionSeleccionada === 'BLOCKTRADE') {
        this.getListadoOrigen();
        this.getListadoDestino();
      }
      this.cancelClick();
    },
    setCurrencySelected(ev) {
      this.currencySelected = ev.target.value;
      this.isBuy = false;
      this.currenciesSelected.forEach((e, i) => {
        if (e === ev.target.value) {
          this.isBuy = i === 1;
        }
      });
    },
    setOperation(ev) {
      this.operationsSelected = ev.target.value;
    },
    async setCalendarPataCorta(ev) {
      this.isFromCalendar = false;
      this.tenorPataCorta = ev.target.selectedOptions[0].label;
      this.calendarTipoPataCorta = ev.target.value;
      this.calendarOptionsPataCorta = this.calendario;
      this.condicionFechasSwap();
      this.removePataCorta();
      if (this.fechaSwapValida) {
        this.getpataCortapataLarga();
      }
    },
    async getRecuperaFechaParam(date) {
      const bodyFecha = {
        fecha: date,
      };
      try {
        await this.$store.dispatch('recuperaFecha', bodyFecha);
        if (this.recuperaFecha.data.result === 'TRUE') {
          this.customModalProps.open = true;
          this.customModalProps.title = 'La fecha de liquidación corresponde a un Derivado';
          this.customModalProps.message = '¿Deseas continuar con la operación?';
          this.customModalProps.type = 'warning';
          this.customModalProps.btnAcceptText = 'Aceptar';
          this.customModalProps.btnCancelText = 'Cancelar';
          this.customModalProps.btnCloseHide = false;
          this.customModalProps.btnCancelFunc = this.closeModal;
          this.customModalProps.btnAcceptFunc = this.validarBanderaDerivados;
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    async setCalendarPataLarga(ev) {
      this.tenorPataLarga = ev.target.selectedOptions[0].label;
      this.calendarTipoPataLarga = ev.target.value;
      this.calendarOptionsPataLarga = this.calendario;
      this.condicionFechasSwap();
      if (this.fechaSwapValida) {
        this.getpataCortapataLarga();
      }
      this.removePataLarga();
    },
    condicionFechasSwap() {
      if (new Date(this.calendarTipoPataCorta) >= new Date(this.calendarTipoPataLarga)) {
        this.fechaSwapValida = false;
      } else {
        this.fechaSwapValida = true;
      }
    },
    setCalendarBlockTradeRows(ev, ind) {
      this.blockTradeRows[ind].fechaSeleccionada = ev.target.value;
      // eslint-disable-next-line max-len
      this.blockTradeRows[ind].calendarOptions = this.blockTradeRows[ind].calendarOptions.filter((blockTradeRow) => blockTradeRow.Description);
    },
    setCalendar(ev) {
      this.calendarSelected = ev.target.value;
      const opcionCalendario = JSON.parse(JSON.stringify(this.calendario)).find((e) => e.date === ev.target.value);
      if (opcionCalendario) {
        if (opcionCalendario.Description === 'SPOT') {
          this.$store.dispatch('updateOperacionSeleccionada', 'SPOT');
          // this.operacion = 'SPOT';
          if (this.calendarActive) {
            this.remove();
          }
        } else {
          this.$store.dispatch('updateOperacionSeleccionada', 'FORWARD');
          // this.operacion = 'FORWARD';
          this.remove();
        }
        this.calendarTipoSelected = opcionCalendario.Description;
      }
    },
    clickOption(txt) {
      if (this.solicitarPrecio) {
        // Se tiene que redireccionar
      } else {
        this.optionSelected = txt;
      }
    },
    getSecondsLeft(sec) {
      let min = Math.floor(sec / 60);
      let seg = sec % 60;
      if (seg < 10) {
        seg = `0${seg}`;
      }
      if (min < 10) {
        min = `0${min}`;
      }
      if (min === 0) {
        return `00:${seg}`;
      }
      return `${min}:${seg}`;
    },
    async getQuotes() {
      const opName = this.optionSelected === 'Twoway' ? 'Twoway' : this.opSide;
      const rsp = await this.$store.dispatch('getQuote', { quoteId: this.qQuoteReqID, opSide: opName, operationName: this.operacionSeleccionada });
      if (rsp.DataIdentifier === 7) {
        const rspMsg = JSON.parse(rsp.Message);
        this.qQuoteReqID = rspMsg.QuoteReqID;
        this.qQuoteID = rspMsg.QuoteID;
        const newCurrencyValueSell = rspMsg.SellPrice;
        const newCurrencyValueBuy = rspMsg.BuyPrice;
        const newCurrencySwpaPointsSell = rspMsg.SwapPointsSell;
        const newCurrencySwpaPointsBuy = rspMsg.SwapPointsBuy;
        if (Number(newCurrencyValueSell) > Number(this.currencyValueSell)) {
          this.valueComparationSell = '+';
        } else if (Number(newCurrencyValueSell) < Number(this.currencyValueSell)) {
          this.valueComparationSell = '-';
        } else {
          this.valueComparationSell = '=';
        }
        if (Number(newCurrencyValueBuy) > Number(this.currencyValueBuy)) {
          this.valueComparationBuy = '+';
        } else if (Number(newCurrencyValueBuy) < Number(this.currencyValueBuy)) {
          this.valueComparationBuy = '-';
        } else {
          this.valueComparationBuy = '=';
        }
        if (Number(newCurrencySwpaPointsSell) > Number(this.currencySwapPointsSell)) {
          this.valueComparationSwapPointsSell = '+';
        } else if (Number(newCurrencySwpaPointsSell) < Number(this.currencySwapPointsSell)) {
          this.valueComparationSwapPointsSell = '-';
        } else {
          this.valueComparationSwapPointsSell = '=';
        }
        if (Number(newCurrencySwpaPointsBuy) > Number(this.currencySwapPointsBuy)) {
          this.valueComparationSwapPointsBuy = '+';
        } else if (Number(newCurrencySwpaPointsBuy) < Number(this.currencySwapPointsBuy)) {
          this.valueComparationSwapPointsBuy = '-';
        } else {
          this.valueComparationSwapPointsBuy = '=';
        }
        this.currencyValueSell = newCurrencyValueSell;
        this.currencyValueBuy = newCurrencyValueBuy;
        this.currencySwapPointsSell = newCurrencySwpaPointsSell;
        this.currencySwapPointsBuy = newCurrencySwpaPointsBuy;
      }
    },
    setNewBlockTradeRowsValues(newValues) {
      if (newValues) {
        this.qQuoteID = newValues.QuoteID;
        this.blockTradeRows = this.blockTradeRows.map((blockTradeRow, ind) => {
          const returnBlockTradeRow = blockTradeRow;
          if (newValues.LegInfo[ind]) {
            const price = blockTradeRow.compra ? 'BuyPrice' : 'SellPrice';
            const priceValue = newValues.LegInfo[ind][price];
            if (returnBlockTradeRow.price) {
              if (Number(returnBlockTradeRow.price) > Number(priceValue)) {
                returnBlockTradeRow.priceComparation = '+';
              } else if (Number(returnBlockTradeRow.price) < Number(priceValue)) {
                returnBlockTradeRow.priceComparation = '-';
              } else {
                returnBlockTradeRow.priceComparation = '';
              }
            }
            returnBlockTradeRow.LegRefID = newValues.LegInfo[ind].QuoteReqID;
            returnBlockTradeRow.price = newValues.LegInfo[ind][price];
            returnBlockTradeRow.sumaTotal = Number(returnBlockTradeRow.price) * Number(returnBlockTradeRow.nocional);
          }
          return returnBlockTradeRow;
        });
      }
    },
    async getQuoteBlock() {
      const rsp = await this.$store.dispatch('getQuoteBlock', { quoteId: this.qQuoteReqID, opSide: this.blockTradeSide });
      if (rsp.data && rsp.data.DataIdentifier === 7) {
        this.setNewBlockTradeRowsValues(rsp.data.message);
      }
    },
    async startTimer() {
      // eslint-disable-next-line no-console
      console.log('entro a timmer', new Date());
      let sec = this.segundosTimmer;
      const segundosPorPeticion = segundoPeticiones || 2;
      this.progress = 100;
      this.timeLeft = this.getSecondsLeft(sec);
      const timer = setInterval(async () => {
        // eslint-disable-next-line no-console
        console.log('en intervarl', new Date());
        this.timeLeft = this.getSecondsLeft(sec);
        let progressAux = sec * 100;
        progressAux /= (this.segundosTimmer + 1);
        this.progress = progressAux;
        sec -= 1;
        if (sec % segundosPorPeticion === 0) {
          if (this.operacionSeleccionada === 'BLOCKTRADE') {
            this.getQuoteBlock();
          } else {
            this.getQuotes();
          }
        }
        if (sec < 0) {
          clearInterval(timer);
          if (this.solicitarPrecio) {
            this.showModalTiempo = true;
          }
        }
      }, 1000);
      this.timmerId = timer;
    },
    cancelClick() {
      clearInterval(this.timmerId);
      this.remove();
      this.removePataCorta();
      this.removePataLarga();
      this.solicitarPrecio = false;
      this.monto = '0';
      // if (this.cancelClickFirst) {
      //   this.cancelClickFirst = false;
      //   const findUSD = this.currenciesOptions.findIndex((item) => item.Ccy1 === 'USD' && item.Ccy2 === 'MXN');
      //   this.setCurrenciesOptions({ target: { value: findUSD || 0 } });
      // }
      if (this.operacionSeleccionada === 'FORWARD') {
        this.calendarSelected = this.datoFechaToday;
      } else if (this.operacionSeleccionada === 'SWAP') {
        this.montoPataCorta = '0';
        this.montoPataLarga = '0';
        this.calendarSelected = this.datoFechaToday;
        if (this.calendarOptions) {
          this.calendarTipoPataCorta = this.calendarOptions[0].date;
          this.calendarTipoPataLarga = this.calendarOptions[1].date;
        }
      } else if (this.operacionSeleccionada === 'BLOCKTRADE') {
        this.blockTradeRows = [{
          fechaSeleccionada: this.calendarOptions[0].date,
          nocional: '0',
          compra: true,
          calendarOptions: [...this.calendarOptions],
        }];
      } else {
        this.calendarSelected = this.datoFechaSpot;
      }
    },
    async eventOperation(opcion) {
      if (this.optionSelected === 'Twoway') {
        this.optionSelected = opcion;
        const opSide = opcion === 'Comprar' ? 'Buy' : 'Sell';
        this.opSide = opSide;
      }
      const currenciesSelected = this.currenciesSelected.join('/');
      const tomorrow = this.calendarSelected.replace(/-/g, '');
      const monto = this.operacionSeleccionada === 'SWAP' ? this.montoPataCorta : this.monto;
      const fechaPataCorta = this.operacionSeleccionada === 'SWAP' ? this.calendarTipoPataCorta.replace(/-/g, '') : '';
      const fechaPataLarga = this.operacionSeleccionada === 'SWAP' ? this.calendarTipoPataLarga.replace(/-/g, '') : '';
      const bodyConcertacion = {
        Account: this.userData.data.user360T,
        CLOrdID: this.qQuoteReqID,
        Currency: this.currencySelected,
        OrderQty: monto.toString(),
        OrderQty2: this.operacionSeleccionada === 'SWAP' ? this.montoPataLarga.toString() : null,
        OrderType: this.orderType,
        Price: this.opSide === 'Buy' ? this.currencyValueBuy : this.currencyValueSell,
        QuoteID: this.qQuoteID,
        SettlDate: this.operacionSeleccionada === 'SWAP' ? fechaPataCorta : tomorrow,
        SettlDate2: this.operacionSeleccionada === 'SWAP' ? fechaPataLarga : null,
        Side: this.opSide,
        Symbol: currenciesSelected,
        Product: this.operacionSeleccionada,
        TransactionId: this.qQuoteReqID,
        RequestSystem: 'PORTALFX',
        InternetFolio: this.userData.data.internetFolio,
      };
      let fechaCatalogoSeleccionada = null;
      if (this.operacionSeleccionada === 'SWAP') {
        const opcionPC = JSON.parse(JSON.stringify(this.calendario)).find((e) => e.date === this.calendarTipoPataCorta);
        if (opcionPC) {
          fechaCatalogoSeleccionada = opcionPC.Description;
        }
      } else {
        const opcionCal = JSON.parse(JSON.stringify(this.calendario)).find((e) => e.date === this.calendarSelected);
        if (opcionCal) {
          fechaCatalogoSeleccionada = opcionCal.Description;
        }
        delete bodyConcertacion.OrderQty2;
        delete bodyConcertacion.SettlDate2;
      }
      clearInterval(this.timmerId);
      this.$store.dispatch('updateFechaCatalogoSeleccionada', fechaCatalogoSeleccionada);
      // this.$store.dispatch('updateOperacionSeleccionada', this.operacion);
      this.$store.dispatch('updateOperacionPataCorta', this.tipoFechaPataCorta);
      this.$store.dispatch('updateOperacionPataLarga', this.tipoFechaPataLarga);
      // eslint-disable-next-line no-console
      console.log('se empezo a consumir el create concertacion', new Date());
      const responseApiConcertacion = await this.$store.dispatch('createConcertacion', bodyConcertacion);
      // eslint-disable-next-line no-console
      console.log('finalizo el consumo del create concertacion', new Date());
      if (responseApiConcertacion.DataIdentifier === 9) {
        this.showModal = true;
      } else {
        this.showModalError = true;
      }
    },
    async eventOperationBloque() {
      const Symbol = this.currenciesSelected.join('/');
      let totalCompra = 0;
      let totalVenta = 0;
      const NoLegs = this.blockTradeRows.map((blockTradeRow) => {
        if (blockTradeRow.compra) {
          totalCompra += blockTradeRow.nocional;
        } else {
          totalVenta += blockTradeRow.nocional;
        }
        const LegSettlDate = blockTradeRow.fechaSeleccionada.replace(/-/g, '');
        return {
          LegSymbol: Symbol,
          LegSidel: blockTradeRow.compra ? '1' : '2',
          LegQty: blockTradeRow.nocional,
          LegSettlDate,
          LegPrice: blockTradeRow.price,
          LegRefID: blockTradeRow.LegRefID,
        };
      });
      const Side = totalCompra > totalVenta ? '1' : '2';
      this.blockTradeSide = Side;
      const bodyCerrarOperacion = {
        CLOrdID: this.qQuoteReqID,
        Currency: this.currencySelected,
        OrderQty: '0',
        Side: this.blockTradeSide,
        Symbol,
        QuoteID: this.qQuoteID,
        NoLegs,
        Account: this.userData.data.user360T,
        Product: 'BLOCKTRADE',
        RequestSystem: 'PORTALFX',
        InternetFolio: this.userData.data.internetFolio,
      };
      clearInterval(this.timmerId);
      const responseApiConcertacion = await this.$store.dispatch('createCerrarOperacion', bodyCerrarOperacion);
      if (responseApiConcertacion.status === 'OK') {
        this.showModal = true;
        localStorage.setItem('subOps', JSON.stringify(NoLegs));
        localStorage.setItem('finalPrice', this.obtenerPromedioBlockTrade());
      } else {
        this.showModalError = true;
      }
    },
    handleClose() {
      this.showModal = false;
    },
    handleOpenError() {
      this.showModalError = true;
    },
    handleCloseError() {
      this.showModalError = false;
      this.solicitarPrecio = false;
    },
    handleCloseTiempo() {
      this.solicitarPrecio = false;
      this.showModalTiempo = false;
    },
    dateFormat() {
      if (!this.calendarSelected) return '';
      const dateArr = this.calendarSelected.split('-');
      return `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    },
    dateCalendar() {
      if (!this.calendarSelected) return '';
      return `${this.calendarSelected}`;
    },
    dateCalendarPataCorta() {
      if (!this.calendarSelected) return '';
      return `${this.calendarTipoPataCorta}`;
    },
    dateCalendarPataLarga() {
      if (!this.calendarSelected) return '';
      return `${this.calendarTipoPataLarga}`;
    },
    handleCloseHorario() {
      this.showModalHorario = false;
    },
    changeTwoway() {
      this.isTwoway = !this.isTwoway;
      if (this.isTwoway) {
        this.clickOption('Twoway');
      } else {
        this.clickOption('Comprar');
      }
    },
    getTokenFromParam() {
      const token = urlParams.get('token');
      const sessionClosed = localStorage.getItem('logout_action');
      const tokenStorage = localStorage.getItem('token_storage');
      this.tkn = null;
      if (sessionClosed && tokenStorage === token) {
        return true;
      }
      this.tkn = token;
      localStorage.removeItem('logout_action');
      localStorage.setItem('token_storage', token);
      return true;
    },
    async validateSession() {
      if (urlParams.has('token')) {
        this.getTokenFromParam();
        await this.$store.dispatch('validarToken', {
          token: this.tkn,
        });
      } else {
        await this.$store.dispatch('setUserData', localStorage.getItem('userData'));
      }
      this.validateUserData();
    },
    validateUserData() {
      if (this.userData && this.userData.data) {
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.isTwoway = this.userData.data.twoWay;
        if (!this.isTwoway) {
          this.optionSelected = 'Comprar';
        }
      } else {
        window.location.href = 'https://cdincom03.invexgf.com/';
      }
    },
    changeBlockTradeRowCompra(ind) {
      this.blockTradeRows[ind].compra = !this.blockTradeRows[ind].compra;
    },
    addBlockTradeRow() {
      const fechaSeleccionada = this.calendarOptions[0] ? this.calendarOptions[0].date : null;
      this.blockTradeRows.push({
        fechaSeleccionada,
        nocional: '0',
        compra: true,
        calendarOptions: [...this.calendarOptions],
      });
    },
    removeBlockTradeRow(ind) {
      this.blockTradeRows.splice(ind, 1);
    },
    changeBlockTradeNotional(ind, ev) {
      this.blockTradeRows[ind].nocional = ev;
    },
    calculateBlockTradeNotional() {
      let totalCompras = 0;
      let totalVentas = 0;
      this.blockTradeRows.forEach((blockTradeRow) => {
        if (blockTradeRow.compra) totalCompras += blockTradeRow.nocional;
        if (!blockTradeRow.compra) totalVentas += blockTradeRow.nocional;
      });
      return Math.abs(totalCompras - totalVentas);
    },
    dateCalendarBlockTradeRow(ind) {
      if (!this.blockTradeRows[ind]) return '';
      if (!this.blockTradeRows[ind].fechaSeleccionada) return '';
      return `${this.blockTradeRows[ind].fechaSeleccionada}`;
    },
    async getListadoOrigen() {
      const body = {
        transactionId: 'INVEXCOMP.TEST-00020220512111543075',
        requestSystem: 'PORTAL',
        source: 'PORTALSYS',
        userId: 'PORTALUSR',
        branch: '001',
        sourceUserId: 'PORTALUSR',
        CustomerNumber: '00004635',
        Type: 'CE',
        InternetFolio: '9254',
        AllowOperate: 'T',
        Currency: this.currencySelected,
      };
      try {
        const response = await this.$store.dispatch('getListaOrigen', body);
        if (Array.isArray(response.cuentas)) {
          this.listadoOrigen = response.cuentas;
        } else {
          this.listadoOrigen = [response.cuentas];
        }
        if (this.listadoOrigen.length > 0) {
          this.setOrigen({ target: { value: this.listadoOrigen[0].customerAccount } });
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getListadoDestino() {
      const body = {
        transactionId: 'INVEXCOMP.TEST-00020220512111543075',
        requestSystem: 'PORTALFX',
        source: 'FXSYS',
        userId: 'FXUSR',
        branch: '001',
        sourceUserId: 'FXUSR',
        CustomerNumber: '00004635',
        Type: 'CE',
        InternetFolio: '9254',
        AllowOperate: 'S',
        Currency: this.currencySelected,
        SameBank: false,
        IsBeneficiaryCreditCard: false,
      };
      try {
        const response = await this.$store.dispatch('getListaDestino', body);
        const respAux = JSON.parse(JSON.stringify(response));
        if (response) {
          if (Array.isArray(respAux)) {
            this.$set(this, 'allListadoDestino', respAux);
          } else {
            this.$set(this, 'allListadoDestino', [respAux]);
          }
          if (this.allListadoDestino.length > 0) {
            this.listadoDestino = [];
            this.destinoSelected = '';
            this.cuentaDestino = null;
            const listadoAux = JSON.parse(JSON.stringify(this.allListadoDestino));
            if (Array.isArray(listadoAux)) {
              listadoAux.forEach((item) => {
                if (item.cuentas.beneficiaryData) {
                  if (Array.isArray(item.cuentas.beneficiaryData.beneficiaryAccount)) {
                    item.cuentas.beneficiaryData.beneficiaryAccount.forEach((item2) => {
                      const auxPush = { ...item2, customerAccount: item.cuentas.customerAccount };
                      this.listadoDestino.push(auxPush);
                    });
                  } else {
                    this.listadoDestino.push({
                      ...item.cuentas.beneficiaryData.beneficiaryAccount,
                      customerAccount: item.cuentas.customerAccount,
                    });
                  }
                }
              });
            }
            this.setDestino({ target: { value: this.listadoDestino[0].BeneficiaryAccount } });
          }
        }
      } catch (error) {
        this.showModalError = true;
      }
    },
    setOrigen(event) {
      this.origenSelected = event.target.value;
      this.cuentaOrigen = this.listadoOrigen.find((item) => item.customerAccount === this.origenSelected);
    },
    setDestino(event) {
      this.destinoSelected = event.target.value;
      this.cuentaDestino = this.listadoDestino.find((item) => item.BeneficiaryAccount === this.destinoSelected);
    },
    origenTxt(origen) {
      if (!origen) return '';
      return `${origen.currency}
                        ${origen.type} - **********${origen.customerAccount.slice(origen.customerAccount.length - 4)}`;
    },
    destinoTxt(destino) {
      if (!destino) return '';
      const destinoAux = JSON.parse(JSON.stringify(destino));
      if (!destinoAux.BeneficiaryAccount) return '';
      return `${this.destinoCurrency} ${destinoAux.BeneficiaryBank} - **********${destinoAux.BeneficiaryAccount.toString()
        .slice(destinoAux.BeneficiaryAccount.toString().length - 4)}`;
    },
    fechaTrade() {
      const fechasBloque = this.blockTradeRows.map((item) => {
        const itemValue = item.fechaSeleccionada;
        return itemValue;
      });
      const max = fechasBloque.reduce((acc, date) => (acc && new Date(acc) > new Date(date) ? acc : date), '');
      this.fechaBloqueMax = max;
    },
    formatoFechaBlockTradeDetail(fecha) {
      moment.locale('es');
      return moment(fecha, 'YYYY-MM-DD HH:mm:ss').format('ddd DD. MMM YYYY');
    },
    formatoPrecioCuatroDigitos(precio) {
      if (!precio) return '';
      const numberPrecio = Number(precio);
      if (numberPrecio.isNaN) return '';
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(numberPrecio);
    },
    obtenerPromedioBlockTrade() {
      const sum = this.blockTradeRows.reduce((acc, curVal) => acc + Number(curVal ? curVal.sumaTotal : 0), 0);
      if (Number.isNaN(sum) || sum === 0) return 0;
      return sum / this.blockTradeRows.length;
    },
    obtenerMontoTotal() {
      let totalCompras = 0;
      let totalVentas = 0;
      this.blockTradeRows.forEach((blockTradeRow) => {
        if (blockTradeRow.compra) totalCompras += blockTradeRow.nocional;
        if (!blockTradeRow.compra) totalVentas += blockTradeRow.nocional;
      });
      return Math.abs(totalCompras - totalVentas);
    },
    async obtenerDerivados(nuevaFecha) {
      let fecha = this.calendarSelected;
      if (nuevaFecha) {
        fecha = nuevaFecha;
      }
      try {
        const { CUI, idGlobal } = this.userData.data;
        const body = {
          cui: CUI,
          fechaOp: fecha,
          montoOp: this.monto,
          idGlobal,
        };
        const respuesta = await InvexRepository.obtenerDerivados(body);
        if (respuesta.status && respuesta.status?.toLowerCase() === 'ok' && respuesta.data) {
          this.parametrosDerivados = respuesta.data;
          this.banderaDerivados = respuesta.data.esCandidato;
          this.esDerivado = respuesta.data.esDerivado;
        }
      } catch (err) {
        // error
      }
    },
    validarBanderaDerivados() {
      if (this.banderaDerivados && this.validaLei && this.parametrosDerivados.vigenteLEI) {
        this.customModalProps.open = false;
        this.onSumbitOperacion();
      } else if (this.banderaDerivados) {
        if (!this.parametrosDerivados.vigenteLEI) {
          this.customModalProps.title = 'La operación no puede realizarse debido a que el código LEI no es vigente';
          this.customModalProps.type = 'warning';
          this.customModalProps.message = 'Por favor contacte a su Ejecutivo en caso de requerir operar Derivados';
          this.customModalProps.open = true;
          this.customModalProps.btnAcceptText = 'Aceptar';
          this.customModalProps.btnCloseHide = true;
          this.customModalProps.btnAcceptFunc = this.closeModal;
        }
        if (!this.validaLei) {
          this.customModalProps.title = 'La operación no puede realizarse debido a que no tiene un código LEI registrado';
          this.customModalProps.type = 'warning';
          this.customModalProps.message = 'Por favor contacte a su Ejecutivo en caso de requerir operar Derivados';
          this.customModalProps.open = true;
          this.customModalProps.btnAcceptText = 'Aceptar';
          this.customModalProps.btnCloseHide = true;
          this.customModalProps.btnAcceptFunc = this.closeModal;
        }
      } else {
        this.customModalProps.title = 'No logramos identificar tu contrato de derivados';
        this.customModalProps.type = 'warning';
        this.customModalProps.message = 'Por favor contacte a su Ejecutivo en caso de requerir operar Derivados';
        this.customModalProps.open = true;
        this.customModalProps.btnAcceptText = 'Aceptar';
        this.customModalProps.btnCloseHide = true;
        this.customModalProps.btnAcceptFunc = this.registrarHistorico;
      }
    },
    registrarHistorico() {
      const { user360T } = this.userData.data;
      const body = {
        usuario: user360T,
      };
      InvexRepository.registrarHistorico(body);
      this.closeModal();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only  -->
<style scoped lang="scss">
$brand-invex: #A41D36;
.btn-outline-operacion {
  &.active {
    border-color: $brand-invex;
    color:white;
    background-color: $brand-invex;
    &:hover {
          color: rgba(255, 255, 255, 1);
          background-color: $brand-invex;
          border-color: $brand-invex;
      }
  }
}
.greenValue {
  color: green;
}

.redValue {
  color: red;
}
.marginPata {
  margin-top: 1em;
  margin-bottom: -2em;
  font-weight: 500;
  p {
    font-weight: 600;
    color: #424242;
    font-size: 14px;
  }
}
</style>
