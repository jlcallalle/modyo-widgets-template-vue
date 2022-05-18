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
              <div class="col-12 col-md-6">
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
                    <template v-for="(value, key, index) in listarOperacion">
                      <option
                        :key="index"
                        :value="value.productCode"
                        :selected="key === 0">
                        {{ value.productCode }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
              <div class="col-12 col-md-6">
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
                    <template v-for="(currency, index) in currenciesOptions">
                      <option
                        :id="index"
                        :key="index"
                        :value="index">
                        {{ currency.Ccy1 }} / {{ currency.Ccy2 }}
                      </option>
                    </template>
                  </select>
                </div>
              </div>
            </div>
            <div
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
                  class="box-vender">
                  <div class="title-operacion">
                    {{ isBuy ? 'Comprar' : 'Vender' }} {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span
                      :class="{greenValue: valueComparationSell === '+',
                               redValue: valueComparationSell === '-'}">
                      {{ currencyValueSell }}
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
                  class="box-vender">
                  <div class="title-operacion">
                    {{ isBuy ? 'Vender' : 'Comprar' }} {{ currencySelected }}
                  </div>
                  <div class="box-precio">
                    <span
                      :class="{greenValue: valueComparationBuy === '+',
                               redValue: valueComparationBuy === '-'}">
                      {{ currencyValueBuy }}
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
            <div class="row">
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
              v-if="operacionSeleccionada !== 'SWAP'"
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
                      <template v-for="(currency, index) in currenciesSelected">
                        <option
                          :id="index"
                          :key="index"
                          :selected="currencySelected === currency"
                          :value="currency">
                          {{ currency }}
                        </option>
                      </template>
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
                      :options="{
                        // eslint-disable-next-line no-irregular-whitespace
                        currency: 'USD',
                        currencyDisplay: 'hidden',
                        locale: 'en-US',
                        precision: 2,
                        valueRange: { min: 0 },
                        hideCurrencySymbolOnFocus: true, }"
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
                      <template v-for="(calendarOp, index) in calendarOptions">
                        <option
                          :id="index"
                          :key="index"
                          :data-tipo="calendarOp.Description"
                          :selected="calendarSelected === calendarOp.date"
                          :value="calendarOp.date">
                          {{ calendarOp.Description }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <!-- <div
                      class="wrapp-fecha">
                      <input
                        disabled
                        type="text"
                        :value="dateFormat()"
                        class="form-control input-fecha">
                    </div> -->
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
                      <template v-for="(currency, index) in currenciesSelected">
                        <option
                          :id="index"
                          :key="index"
                          :selected="currencySelected === currency"
                          :value="currency">
                          {{ currency }}
                        </option>
                      </template>
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
                      :options="{
                        // eslint-disable-next-line no-irregular-whitespace
                        currency: 'USD',
                        currencyDisplay: 'hidden',
                        locale: 'en-US',
                        precision: 2,
                        valueRange: { min: 0 },
                        hideCurrencySymbolOnFocus: true, }"
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
                      <template v-for="(calendarOp, index) in calendarOptions">
                        <option
                          :id="index"
                          :key="index"
                          :data-tipo="calendarOp.Description"
                          :selected="calendarTipoPataCorta === calendarOp.date"
                          :value="calendarOp.date">
                          {{ calendarOp.Description }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <!-- <div
                      class="wrapp-fecha">
                      <input
                        disabled
                        type="text"
                        :value="dateFormat()"
                        class="form-control input-fecha">
                    </div> -->
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
                      <template v-for="(currency, index) in currenciesSelected">
                        <option
                          :id="index"
                          :key="index"
                          :selected="currencySelected === currency"
                          :value="currency">
                          {{ currency }}
                        </option>
                      </template>
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
                      :options="{
                        // eslint-disable-next-line no-irregular-whitespace
                        currency: 'USD',
                        currencyDisplay: 'hidden',
                        locale: 'en-US',
                        precision: 2,
                        valueRange: { min: 0 },
                        hideCurrencySymbolOnFocus: true, }"
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
                      <template v-for="(calendarOp, index) in calendarOptions">
                        <option
                          :id="index"
                          :key="index"
                          :data-tipo="calendarOp.Description"
                          :selected="calendarTipoPataLarga === calendarOp.date"
                          :value="calendarOp.date">
                          {{ calendarOp.Description }}
                        </option>
                      </template>
                    </select>
                  </div>
                  <div class="box-input-row">
                    <!-- <div
                      class="wrapp-fecha">
                      <input
                        disabled
                        type="text"
                        :value="dateFormat()"
                        class="form-control input-fecha">
                    </div> -->
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
      dataTwoWay: null,
      progress: 100,
      timeLeft: '00:60',
      segundosTimmer: 59,
      solicitarPrecio: false,
      // operacionSeleccionada: 'SPOT',
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
      currencyValueBuy: 22.749,
      currencyValueSell: 22.749,
      valueComparationBuy: '',
      valueComparationSell: '',
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
    };
  },
  computed: {
    ...mapState(['loading']),
    ...mapState(['currentView']),
    ...mapState(['mapClientLogeo']),
    ...mapState(['servicio']),
    ...mapState(['listarOperacion']),
    ...mapState(['listaOperaciones']),
    ...mapState(['horario']),
    ...mapState(['recuperaFecha']),
    ...mapState(['userData']),
    ...mapState([
      'listaDivisas',
      'calendario',
      'quoteRequest',
      'operacionSeleccionada',
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
      const datoFechaSeleccionada = this.calendario.find((item) => item.Description === 'SPOT');
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
  },
  async mounted() {
    // Se puede comentar esta parte para temas de desarrollo
    if (ENVIROMENT === 'production') {
      this.getTokenFronParam();
      await this.$store.dispatch('validarToken', {
        token: this.tkn,
      });
      this.validateUserData();
    } else {
      this.dataTwoWay = false;
    }
    // Fin de lo que se puede comentar para temas de desarrollo
    await this.getCurrencies();
    await this.getOperations();
    this.getValueTwoWay();
    await this.getHoraRestriccion();
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
    const responseApiServicio = await this.$store.dispatch('updateServicio');
    if (responseApiServicio.status === 200 || responseApiServicio.status === 201) {
      // console.log('servicio ok');
    } else {
      // console.log('servicio error');
      // this.showModalError = true;
    }
    const responseApiOperaciones = await this.$store.dispatch('updateListarOperaciones');
    if (responseApiOperaciones.status === 200 || responseApiOperaciones.status === 201) {
      // console.log('operaciones ok');
    } else {
      // console.log('operaciones error');
      // this.showModalError = true;
    }
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
    onDayClick(ev) {
      this.calendarActive = true;
      const fechaCal = ev.id;
      this.calendarSelected = fechaCal;
      const dataSpot = this.datoFechaSpot;
      if (fechaCal === dataSpot) {
        this.seleccionarOperacion({ target: { value: 'SPOT' } });
      } else if (this.calendarOptions.length === 27) {
        this.add();
      }
    },
    onDayClickPataCorta(ev) {
      this.calendarActive = true;
      const fechaCal = ev.id;
      this.calendarTipoPataCorta = fechaCal;
      if (this.calendarOptions.length === 27) {
        this.add();
      }
      this.condicionFechasSwap();
    },
    onDayClickPataLarga(ev) {
      this.calendarActive = true;
      const fechaCal = ev.id;
      this.calendarTipoPataLarga = fechaCal;
      if (this.calendarOptions.length === 27) {
        this.add();
      }
      this.condicionFechasSwap();
    },
    deshabilitarBotonSubmit() {
      const horarioStatus = this.horario ? this.horario.status : '';
      if (this.calendarOptions.length === 0 || horarioStatus === 'offline' || !this.fechaSwapValida) return true;
      if (this.operacionSeleccionada === 'SWAP') {
        return this.montoPataCorta === 0 || this.montoPataCorta === '0' || this.montoPataCorta === null || this.montoPataLarga === 0 || this.montoPataLarga === '0' || this.montoPataLarga === null;
      }
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
            Account: 'INVEXCOMP.TEST',
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
        this.qQuoteID = rspMsg.QuoteID;
        this.qQuoteReqID = rspMsg.QuoteReqID;
        this.solicitarPrecio = true;
        this.startTimer();
      } catch (err) {
        // console.log(err);
      }
    },
    async onSubmit() {
      if (this.solicitarPrecio) {
        this.solicitarPrecio = false;
        clearInterval(this.timmerId);
      } else {
        this.segundosTimmer = 59;
        switch (this.operacionSeleccionada) {
          case 'SPOT':
            await this.onSumbitOperacion();
            break;
          case 'SWAP':
            this.segundosTimmer = 119;
            await this.onSumbitOperacion();
            break;
          case 'FORWARD':
            await this.getRecuperaFecha();
            if (this.recuperaFecha.data.result === 'TRUE') {
              this.customModalProps.open = true;
              this.customModalProps.title = 'La fecha de liquidación corresponde a un Derivado';
              this.customModalProps.message = '¿Deseas continuar con la operación?';
              this.customModalProps.type = 'warning';
              this.customModalProps.btnAcceptText = 'Aceptar';
              this.customModalProps.btnCancelText = 'Cancelar';
              this.customModalProps.btnCloseHide = false;
              this.customModalProps.btnCancelFunc = this.closeModal;
              this.customModalProps.btnAcceptFunc = this.closeModal;
            } else {
              await this.onSumbitOperacion();
            }
            break;
          default:
            await this.onSumbitOperacion();
            break;
        }
      }
    },
    async getOperations() {
      try {
        await this.$store.dispatch('getListaOperaciones');
      } catch (error) {
        this.showModalError = true;
      }
    },
    async getCurrencies() {
      try {
        await this.$store.dispatch('getDivisas');
        this.currenciesOptions = this.listaDivisas;
        const findUSD = this.currenciesOptions.findIndex((item) => item.Ccy1 === 'USD' && item.Ccy2 === 'MXN');
        this.setCurrenciesOptions({ target: { value: findUSD || 0 } });
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
    async getCalendar() {
      try {
        const currenciesSelected = this.currenciesSelected.join('/');
        // console.log('currenciesSelected', currenciesSelected);
        await this.$store.dispatch('getCalendario', currenciesSelected);
        this.calendarOptions = this.calendario;
        const spot = JSON.parse(JSON.stringify(this.calendario)).find((item) => item.Description === 'SPOT');
        if (spot) {
          this.calendarSelected = spot.date;
        } else if (this.calendarOptions.length > 0) {
          this.calendarSelected = this.calendarOptions[0].date;
        }
        if (this.operacionSeleccionada === 'FORWARD') {
          this.calendarSelected = this.calendarOptions[0].date;
        }
      } catch (error) {
        this.showModalError = true;
      }
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
    setCurrenciesOptions(ev) {
      if (this.currenciesOptions.length > ev.target.value) {
        const auxSelected = this.currenciesOptions[ev.target.value];
        this.currencySelectedId = ev.target.value;
        this.currenciesSelected = [auxSelected.Ccy1, auxSelected.Ccy2];
        this.currencySelected = auxSelected.Ccy1;
        this.isBuy = false;
        this.getCalendar();
      }
    },
    seleccionarOperacion(ev) {
      this.fechaSwapValida = true;
      this.$store.dispatch('updateOperacionSeleccionada', ev.target.value);
      if (this.operacionSeleccionada === 'SPOT') {
        this.calendarSelected = this.datoFechaSpot;
        if (this.calendarActive === true) {
          this.remove();
        }
      } else if (this.operacionSeleccionada === 'FORWARD') {
        this.calendarSelected = this.datoFechaToday;
      } else if (this.operacionSeleccionada === 'SWAP') {
        this.calendarTipoPataCorta = this.datoFechaToday;
        this.calendarTipoPataLarga = this.datoFechaTomorrow;
      }
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
    setCalendarPataCorta(ev) {
      this.calendarTipoPataCorta = ev.target.value;
      this.condicionFechasSwap();
    },
    setCalendarPataLarga(ev) {
      this.calendarTipoPataLarga = ev.target.value;
      this.condicionFechasSwap();
    },
    condicionFechasSwap() {
      if (new Date(this.calendarTipoPataCorta) >= new Date(this.calendarTipoPataLarga)) {
        this.fechaSwapValida = false;
      } else {
        this.fechaSwapValida = true;
      }
    },
    setCalendar(ev) {
      this.calendarSelected = ev.target.value;
      const opcionCalendario = JSON.parse(JSON.stringify(this.calendario)).find((e) => e.date === ev.target.value);
      if (opcionCalendario) {
        if (opcionCalendario.Description === 'SPOT') {
        // this.operacionSeleccionada = 'SPOT';
          this.$store.dispatch('updateOperacionSeleccionada', 'SPOT');
          if (this.calendarActive) {
            this.remove();
          }
        } else {
          this.$store.dispatch('updateOperacionSeleccionada', 'FORWARD');
          this.remove();
          // this.operacionSeleccionada = 'FORWARD';
        }
        this.calendarTipoSelected = opcionCalendario.Description;
      }
    },
    setCurrency(id) {
      const findId = this.currenciesOptions.find((currency) => currency.id === id);
      if (findId) {
        this.currencySelectedId = id;
        this.setCurrenciesOptions({ target: { value: id } });
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
          const opName = this.optionSelected === 'Twoway' ? 'Twoway' : this.opSide;
          const rsp = await this.$store.dispatch('getQuote', { quoteId: this.qQuoteReqID, opSide: opName, operationName: this.operacionSeleccionada });
          if (rsp.DataIdentifier === 7) {
            const rspMsg = JSON.parse(rsp.Message);
            this.qQuoteReqID = rspMsg.QuoteReqID;
            this.qQuoteID = rspMsg.QuoteID;
            const newCurrencyValueSell = rspMsg.SellPrice;
            const newCurrencyValueBuy = rspMsg.BuyPrice;
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
            this.currencyValueSell = newCurrencyValueSell;
            this.currencyValueBuy = newCurrencyValueBuy;
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
      if (this.operacionSeleccionada === 'FORWARD') {
        clearInterval(this.timmerId);
        this.solicitarPrecio = false;
        this.monto = '0';
      } else {
        window.location.reload();
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
        Account: this.wsAccount,
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
      }
      this.$store.dispatch('updateFechaCatalogoSeleccionada', fechaCatalogoSeleccionada);
      this.$store.dispatch('updateOperacionSeleccionada', this.operacionSeleccionada);
      this.$store.dispatch('updateOperacionPataCorta', this.tipoFechaPataCorta);
      this.$store.dispatch('updateOperacionPataLarga', this.tipoFechaPataLarga);
      clearInterval(this.timmerId);
      // eslint-disable-next-line no-console
      console.log('se empezo a consumir el create concertacion', new Date());
      const responseApiConcertacion = await this.$store.dispatch('createConcertacion', bodyConcertacion);
      // eslint-disable-next-line no-console
      console.log('finalizo el consumo del create concertacion', new Date());
      if (responseApiConcertacion.DataIdentifier === 9) {
        this.showModal = true;
        // console.log('concertacion ok');
      } else {
        this.showModalError = true;
        // console.log('concertacion error');
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
    getTokenFronParam() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const token = urlParams.get('token');
      this.tkn = token;
    },
    validateUserData() {
      if (this.userData && this.userData.data) {
        this.isTwoway = this.userData.data.twoWay;
        if (this.isTwoway === false) {
          this.optionSelected = 'Comprar';
        }
      } else {
        window.location.href = 'https://cdincom03.invexgf.com/';
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
}
</style>
