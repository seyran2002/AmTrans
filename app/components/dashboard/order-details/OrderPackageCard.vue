<template>
  <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {{ t('manageOrders.packageDetails') }}
          </h2>
          <span class="text-xs text-slate-400 font-medium">
            {{ order.marketName }}
          </span>
        </div>
      </div>

      <!-- Operator Edit Button -->
      <button
        v-if="isOperator && !isEditing"
        type="button"
        @click="startEdit"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {{ t('manageOrders.editPackageDetails') }}
      </button>
    </div>

    <!-- ── PRICING SECTION ──────────────────────────────────────────────── -->
    <div class="space-y-3">
      <!-- 1. PENDING ESTIMATE without estimate: Operator Price Submission Form -->
      <div
        v-if="order.status === 'PENDING_ESTIMATE' && !order.estimatedPrice && !submittedEstimatePrice"
        class="p-5 rounded-3xl bg-gradient-to-br from-amber-500/[0.08] to-primary/[0.04] border-2 border-amber-300 shadow-sm space-y-4"
      >
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300/80 shadow-2xs">
            <svg class="w-5 h-5 text-amber-700 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {{ t('manageOrders.submitEstimateTitle') }}
            </h3>
            <p class="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
              {{ t('manageOrders.submitEstimateSubtitle') }}
            </p>
          </div>
        </div>

        <!-- Estimate Form Error -->
        <div v-if="estimateError" class="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 font-semibold">
          {{ estimateError }}
        </div>

        <!-- Estimate Form Success -->
        <div v-if="estimateSuccessMessage" class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
          {{ estimateSuccessMessage }}
        </div>

        <!-- Estimate Form Input & Submit Action -->
        <form @submit.prevent="handleSubmitEstimate" class="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pt-1">
          <div class="flex-1 space-y-1">
            <label for="proposed-price-input" class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {{ t('manageOrders.proposedShippingPrice') }} <span class="text-red-500">*</span>
            </label>
            <div class="relative rounded-2xl">
              <input
                id="proposed-price-input"
                v-model="proposedPriceInput"
                type="number"
                step="any"
                min="1"
                required
                :disabled="isSubmittingEstimate || !isOperator"
                :placeholder="t('manageOrders.proposedPricePlaceholder')"
                class="w-full pl-4 pr-20 py-3 text-sm font-bold rounded-2xl border border-slate-200/90 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all disabled:opacity-60"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                AMD/kg
              </span>
            </div>
            <div v-if="previewPriceFromInput" class="text-xs text-amber-800 font-semibold pt-1">
              {{ t('orders.calculatedShippingPrice') }}:
              <span class="font-bold text-amber-950">{{ formatAmount(previewPriceFromInput) }} AMD</span>
              <span class="text-[11px] text-slate-500 ml-1">({{ chargeableWeight }} kg × {{ formatAmount(proposedPriceInput) }} AMD/kg)</span>
            </div>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="sm"
            :loading="isSubmittingEstimate"
            :disabled="isSubmittingEstimate || !isProposedPriceValid || !isOperator"
            class="sm:h-[46px] shrink-0 w-max"
          >
            {{ isSubmittingEstimate ? t('manageOrders.submittingEstimate') : t('manageOrders.submitEstimateBtn') }}
          </BaseButton>
        </form>
      </div>

      <!-- 2. PENDING ESTIMATE with estimate submitted: Waiting for Customer -->
      <div
        v-else-if="order.status === 'PENDING_ESTIMATE' && (order.estimatedPrice || submittedEstimatePrice)"
        class="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-primary/[0.04] border border-amber-300/80 shadow-sm space-y-3"
      >
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {{ t('manageOrders.awaitingCustomerApproval') }}
          </span>

          <span class="text-xs text-slate-500 font-medium" v-if="order.estimatedAt">
            {{ t('manageOrders.submittedAt') }}: <strong class="text-slate-700">{{ formatDate(order.estimatedAt) }}</strong>
          </span>
        </div>

        <div class="flex items-baseline justify-between pt-1">
          <div>
            <span class="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              {{ t('manageOrders.proposedShippingPrice') }}
            </span>
            <div class="flex items-baseline gap-1.5 mt-0.5">
              <span class="text-3xl font-black text-amber-950 tracking-tight">
                {{ formatAmount(calculatedEstimatePrice ?? (order.estimatedPrice || submittedEstimatePrice)) }}
              </span>
              <span class="text-sm font-bold text-amber-800">AMD</span>
            </div>
            <span v-if="chargeableWeight > 0" class="text-[11px] text-amber-800/80 font-medium block mt-0.5">
              {{ chargeableWeight }} kg × {{ formatAmount(order.estimatedPrice || submittedEstimatePrice) }} AMD/kg
            </span>
          </div>

          <div v-if="order.estimatedBy" class="text-right text-xs text-slate-500">
            <span class="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {{ t('manageOrders.submittedBy') }}
            </span>
            <span class="font-bold text-slate-700">
              {{ [order.estimatedBy.firstName, order.estimatedBy.lastName].filter(Boolean).join(' ') || order.estimatedBy.email }}
            </span>
          </div>
        </div>
      </div>

      <!-- 3. Transit Price (for standard orders) -->
      <div
        v-else-if="effectiveOrderPrice !== null"
        class="p-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 shadow-sm"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-[11px] font-bold text-white/70 uppercase tracking-wider mb-0.5">
            {{ isLockedTariff ? t('orders.lockedPrice') : t('manageOrders.transitPrice') }}
          </p>
          <span
            v-if="isLockedTariff"
            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/15 text-white border border-white/20"
            :title="t('orders.priceLockedAtBooking')"
          >
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {{ t('orders.priceLockedAtBooking') }}
          </span>
        </div>
        <p class="text-xs text-white/60 font-medium mb-2">{{ t('manageOrders.transitPriceHint') }}</p>
        <div class="flex items-baseline gap-1.5">
          <span class="text-xl sm:text-2xl font-black text-white tracking-tight">
            {{ formatAmount(effectiveOrderPrice) }}
          </span>
          <span class="text-sm font-bold text-white/80">AMD</span>
        </div>
      </div>

      <!-- Applied Tariff + Product Price side by side -->
      <div class="grid grid-cols-2 gap-2.5">
        <!-- Applied Tariff / Tariff at Booking -->
        <div
          v-if="order.fromOffice && order.toOffice"
          class="p-3 rounded-2xl bg-primary/[0.04] border border-primary/15"
        >
          <div class="flex items-center justify-between gap-1 mb-1">
            <p class="text-[10px] font-bold text-primary uppercase tracking-wider">
              {{ isLockedTariff ? t('orders.tariffAtBooking') : t('manageOrders.appliedTariff') }}
            </p>
            <span
              v-if="isLockedTariff"
              class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800"
              :title="t('orders.priceLockedAtBooking')"
            >
              <svg class="w-2.5 h-2.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Locked
            </span>
          </div>
          <div v-if="isRouteTariffLoading && !isLockedTariff" class="flex items-center gap-1.5 text-xs text-slate-400 animate-pulse">
            <svg class="w-3 h-3 animate-spin text-primary shrink-0" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>...</span>
          </div>
          <div v-else-if="appliedTariffRate" class="flex items-baseline gap-1">
            <span class="text-base font-extrabold text-primary">{{ formatAmount(appliedTariffRate) }}</span>
            <span class="text-[11px] font-bold text-primary/70">AMD/kg</span>
          </div>
          <span v-else-if="order.status === 'PENDING_ESTIMATE'" class="text-xs text-amber-700 font-bold">
            -
          </span>
          <span v-else class="text-xs text-slate-400 font-medium">—</span>
        </div>

        <!-- Product Price -->
        <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            {{ t('manageOrders.productPriceLabel') }}
          </p>
          <div class="flex items-baseline gap-1">
            <span class="text-base font-extrabold text-slate-800">{{ formatAmount(order.productPrice) }}</span>
            <span class="text-[11px] font-bold text-slate-500">{{ order.currency }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── VIEW MODE ─────────────────────────────────────────────────────── -->
    <template v-if="!isEditing">
      <!-- Product & Store Information -->
      <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="flex items-center gap-2 min-w-0">
            <div class="w-5 h-5 rounded-md bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span class="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0">
              {{ t('manageOrders.market') }}:
            </span>
            <span class="text-sm font-extrabold text-slate-900 truncate">
              {{ order.marketName }}
            </span>
          </div>

          <!-- Product Condition Badge -->
          <span
            :class="[
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border shadow-xs',
              order.isNew === false
                ? 'bg-amber-50 text-amber-800 border-amber-200/80'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
            ]"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="order.isNew === false ? 'bg-amber-500' : 'bg-emerald-500'"
            />
            {{ order.isNew === false ? t('orders.productUsed') : t('orders.productNew') }}
          </span>
        </div>

        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {{ t('orders.productDescription') }}:
          </span>
          <p class="text-sm text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
            {{ order.productDescription }}
          </p>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <!-- Piece Count -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {{ t('orders.pieceCount') }}
          </span>
          <div class="text-base font-extrabold text-slate-900 flex items-baseline gap-1">
            {{ order.pieceCount ?? 1 }} <span class="text-xs font-medium text-slate-400">{{ t('orders.pieces') }}</span>
          </div>
        </div>

        <!-- Actual Weight -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {{ t('manageOrders.weight') }}
          </span>
          <div class="text-base font-extrabold text-slate-900 flex items-baseline gap-1">
            {{ order.weight }} <span class="text-xs font-medium text-slate-400">kg</span>
          </div>
        </div>

        <!-- Dimensions -->
        <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {{ t('manageOrders.dimensions') }}
          </span>
          <div class="text-base font-extrabold text-slate-900 truncate" :title="`${order.length} × ${order.width} × ${order.height} cm`">
            {{ order.length }}×{{ order.width }}×{{ order.height }} <span class="text-xs font-medium text-slate-400">cm</span>
          </div>
        </div>

        <!-- Volumetric Weight -->
        <div class="p-3.5 rounded-2xl bg-primary/5 border border-primary/10 space-y-1">
          <span class="text-[10px] font-bold text-primary uppercase tracking-wider block">
            {{ t('manageOrders.volumetricWeight') }}
          </span>
          <div class="text-base font-extrabold text-primary flex items-baseline gap-1">
            {{ volumetricWeight }} <span class="text-xs font-medium text-primary/70">kg</span>
          </div>
        </div>

        <!-- Billable Weight -->
        <div class="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 space-y-1 col-span-2 sm:col-span-1">
          <div class="flex items-center justify-between gap-1">
            <span class="text-[10px] font-bold text-primary uppercase tracking-wider block">
              {{ t('orders.billableWeight') }}
            </span>
            <span
              v-if="billableWeight > chargeableWeight"
              class="text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1 py-0.5 rounded"
            >
              min 5kg
            </span>
          </div>
          <div class="text-base font-extrabold text-primary flex items-baseline gap-1">
            {{ billableWeight.toFixed(2) }} <span class="text-xs font-medium text-primary/70">kg</span>
          </div>
        </div>
      </div>

      <!-- TN VED Code if available -->
      <div v-if="order.tnVedCode" class="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
        <span class="text-slate-500 font-medium">{{ t('manageOrders.tnVedCode') }}:</span>
        <span class="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
          {{ order.tnVedCode }}
        </span>
      </div>

      <!-- Optional Comment Callout -->
      <div v-if="order.comment" class="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1 text-xs">
        <div class="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[11px]">
          <svg class="w-3.5 h-3.5 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span>{{ t('manageOrders.comment') }}</span>
        </div>
        <p class="text-amber-950 font-medium italic leading-relaxed break-words">
          "{{ order.comment }}"
        </p>
      </div>

      <!-- Attached Invoice Section -->
      <div class="pt-4 border-t border-slate-100">
        <div v-if="order.invoiceUrl" class="space-y-2">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {{ t('manageOrders.invoice') }}
          </span>
          <a
            :href="order.invoiceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-3 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-all text-primary font-bold text-xs group"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="truncate">
                <span class="block truncate">{{ t('manageOrders.downloadInvoice') }}</span>
                <span class="text-[10px] text-slate-400 font-medium block">PDF / Image Document</span>
              </div>
            </div>
            <svg class="w-4 h-4 text-primary shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div v-else class="text-xs text-slate-400 italic py-1">
          {{ t('manageOrders.noInvoice') }}
        </div>
      </div>
    </template>

    <!-- ── EDIT MODE (Operator only) ─────────────────────────────────────── -->
    <template v-else>
      <!-- Edit Error Banner -->
      <div v-if="editError" class="p-3 rounded-2xl bg-red-50/90 border border-red-200/90 text-xs text-red-800 font-medium">
        {{ editError }}
      </div>

      <form @submit.prevent="handleSave" class="space-y-4">
        <!-- Market Name -->
        <div class="space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
            {{ t('orders.marketName') }}
          </label>
          <input
            v-model="editForm.marketName"
            type="text"
            :placeholder="t('orders.marketNamePlaceholder')"
            :disabled="isSaving"
            class="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
          />
          <p v-if="editErrors.marketName" class="text-xs text-red-600 font-semibold mt-1">{{ editErrors.marketName }}</p>
        </div>

        <!-- Product Description -->
        <div class="space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
            {{ t('orders.productDescription') }}
          </label>
          <textarea
            v-model="editForm.productDescription"
            :placeholder="t('orders.productDescriptionPlaceholder')"
            :disabled="isSaving"
            rows="3"
            class="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60 resize-none"
          />
          <p v-if="editErrors.productDescription" class="text-xs text-red-600 font-semibold mt-1">{{ editErrors.productDescription }}</p>
        </div>

        <!-- Product Price + Currency -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
              {{ t('orders.productPrice') }}
            </label>
            <input
              v-model="editForm.productPrice"
              type="number"
              step="any"
              min="0"
              :disabled="isSaving"
              class="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
            />
            <p v-if="editErrors.productPrice" class="text-xs text-red-600 font-semibold mt-1">{{ editErrors.productPrice }}</p>
          </div>
          <div class="space-y-1">
            <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
              {{ t('orders.currency') }}
            </label>
            <select
              v-model="editForm.currency"
              :disabled="isSaving"
              class="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="AED">AED</option>
              <option value="RUB">RUB</option>
              <option value="AMD">AMD</option>
            </select>
          </div>
        </div>

        <!-- Piece Count + Product Condition -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          <div class="space-y-1">
            <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
              {{ t('orders.pieceCount') }}
            </label>
            <input
              v-model="editForm.pieceCount"
              type="number"
              min="1"
              step="1"
              :disabled="isSaving"
              class="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
            />
            <p v-if="editErrors.pieceCount" class="text-xs text-red-600 font-semibold mt-1">{{ editErrors.pieceCount }}</p>
          </div>

          <ProductConditionSwitch
            v-model="editForm.isNew"
            :disabled="isSaving"
          />
        </div>

        <!-- Weight + Dimensions -->
        <div>
          <p class="block text-xs font-bold uppercase tracking-wider text-primary/90 mb-2">
            {{ t('orders.dimensions') }}
            <span class="text-slate-400 normal-case font-normal ml-1">(cm / kg)</span>
          </p>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ t('orders.weight') }}</label>
              <input
                v-model="editForm.weight"
                type="number"
                step="any"
                min="0"
                :disabled="isSaving"
                class="w-full px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
              />
              <p v-if="editErrors.weight" class="text-[10px] text-red-600 font-semibold">{{ editErrors.weight }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ t('orders.length') }}</label>
              <input
                v-model="editForm.length"
                type="number"
                step="any"
                min="0"
                :disabled="isSaving"
                class="w-full px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
              />
              <p v-if="editErrors.length" class="text-[10px] text-red-600 font-semibold">{{ editErrors.length }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ t('orders.width') }}</label>
              <input
                v-model="editForm.width"
                type="number"
                step="any"
                min="0"
                :disabled="isSaving"
                class="w-full px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
              />
              <p v-if="editErrors.width" class="text-[10px] text-red-600 font-semibold">{{ editErrors.width }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{{ t('orders.height') }}</label>
              <input
                v-model="editForm.height"
                type="number"
                step="any"
                min="0"
                :disabled="isSaving"
                class="w-full px-3 py-2.5 text-sm font-medium rounded-xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60"
              />
              <p v-if="editErrors.height" class="text-[10px] text-red-600 font-semibold">{{ editErrors.height }}</p>
            </div>
          </div>
        </div>

        <!-- TN VED Code -->
        <div class="space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
            {{ t('manageOrders.tnVedCode') }}
          </label>
          <input
            v-model="editForm.tnVedCode"
            type="text"
            :placeholder="t('manageOrders.tnVedCodePlaceholder')"
            :disabled="isSaving"
            class="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60 font-mono"
          />
        </div>

        <!-- Comment -->
        <div class="space-y-1">
          <label class="block text-xs font-bold uppercase tracking-wider text-primary/90">
            {{ t('orders.comment') }}
          </label>
          <textarea
            v-model="editForm.comment"
            :placeholder="t('orders.commentPlaceholder')"
            :disabled="isSaving"
            rows="2"
            class="w-full px-4 py-3 text-sm font-medium rounded-2xl border border-slate-200/90 bg-white/90 text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all disabled:opacity-60 resize-none"
          />
        </div>

        <!-- Recalculate Price hint + price field -->
        <div
          v-if="recalculatedPrice !== null"
          class="p-3 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-between text-xs"
        >
          <span class="font-medium text-slate-600">{{ t('manageOrders.recalculatePrice') }}:</span>
          <div class="flex items-baseline gap-1">
            <span class="text-base font-extrabold text-primary">{{ formatAmount(recalculatedPrice) }}</span>
            <span class="text-xs font-bold text-primary/70">AMD</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2">
          <button
            type="button"
            @click="cancelEdit"
            :disabled="isSaving"
            class="flex-1 py-2.5 px-4 rounded-2xl border-2 border-slate-200 text-slate-600 text-sm font-bold hover:border-slate-300 transition-all disabled:opacity-50"
          >
            {{ t('manageOrders.cancelEdit') }}
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="flex-1 py-2.5 px-4 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ isSaving ? t('manageOrders.saving') : t('manageOrders.saveChanges') }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, onMounted } from 'vue'
import ProductConditionSwitch from '~/components/ui/ProductConditionSwitch.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useI18n } from '~/composables/useI18n'
import { useAuth } from '~/composables/useAuth'
import { useTariffs } from '~/composables/useTariffs'
import { useSystemSettings } from '~/composables/useSystemSettings'
import { useApi } from '~/composables/useApi'
import { ordersService } from '~/services/orders.service'
import type { Order, UpdateOrderPayload, OrderCurrency } from '~/types/order'

interface Props {
  order: Order
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'updated', order: Order): void
}>()

const { t, currentLanguage } = useI18n()
const { user } = useAuth()
const { apiFetch, getApiUrl } = useApi()
const token = useCookie<string | null>('auth_token')

// ─── Role check ─────────────────────────────────────────────────────────────
const isOperator = computed(() => {
  const role = user.value?.role?.toUpperCase()
  return role === 'OPERATOR' || role === 'ADMIN'
})

// ─── Tariff fetching for display ─────────────────────────────────────────────
const {
  routeTariff,
  isRouteTariffLoading,
  clearRouteTariff,
  fetchTariffByRoute
} = useTariffs()

const {
  volumetricDivisor,
  fetchSettings
} = useSystemSettings()

const volumetricWeight = computed<string>(() => {
  const l = Number(props.order.length) || 0
  const w = Number(props.order.width) || 0
  const h = Number(props.order.height) || 0
  if (!l || !w || !h) return '0.00'
  const vol = (l * w * h) / volumetricDivisor.value
  return vol.toFixed(2)
})

const actualWeight = computed<number>(() => {
  return Number(props.order.weight) || 0
})

const numericVolumetricWeight = computed<number>(() => {
  const l = Number(props.order.length) || 0
  const w = Number(props.order.width) || 0
  const h = Number(props.order.height) || 0
  if (!l || !w || !h) return 0
  const div = volumetricDivisor.value || 5000
  return (l * w * h) / div
})

// Chargeable weight based on volumetric weight or just actual weight
const chargeableWeight = computed<number>(() => {
  const actual = actualWeight.value
  const vol = numericVolumetricWeight.value
  if (vol > 0 && actual > 0) {
    return Math.round(Math.max(actual, vol) * 100) / 100
  }
  return Math.round((actual || vol || 0) * 100) / 100
})

// Billable weight (5kg minimum policy enforced)
const billableWeight = computed<number>(() => {
  if (props.order.billableWeight !== undefined && props.order.billableWeight !== null && Number(props.order.billableWeight) > 0) {
    return Number(props.order.billableWeight)
  }
  return Math.max(chargeableWeight.value, 5)
})

const isLockedTariff = computed<boolean>(() => {
  return Boolean(props.order.tariffRateAtBooking && Number(props.order.tariffRateAtBooking) > 0)
})

const effectiveOrderPrice = computed<number | null>(() => {
  const p = props.order.totalPrice ?? props.order.price
  if (p !== undefined && p !== null && !isNaN(Number(p))) {
    return Number(p)
  }
  return null
})

const submittedEstimatePrice = ref<number | null>(null)

// Applied tariff rate per kg (reads locked tariffRateAtBooking first, then routeTariff or estimatedPrice)
const appliedTariffRate = computed<number | string | null>(() => {
  if (props.order.tariffRateAtBooking && Number(props.order.tariffRateAtBooking) > 0) {
    return props.order.tariffRateAtBooking
  }
  if (routeTariff.value?.pricePerKg) {
    return routeTariff.value.pricePerKg
  }
  if (props.order.status === 'PENDING_ESTIMATE') {
    return props.order.estimatedPrice || submittedEstimatePrice.value
  }
  return props.order.estimatedPrice || null
})

// Calculate shipping price using estimatedPrice and volumetric weight or just weight
const calculatedEstimatePrice = computed<number | null>(() => {
  const rate = Number(props.order.estimatedPrice || submittedEstimatePrice.value)
  if (!rate || rate <= 0) return null
  const weight = billableWeight.value
  if (!weight || weight <= 0) return null
  return Math.round(weight * rate * 100) / 100
})

// Load tariff on mount whenever fromOffice and toOffice are both present
const loadTariff = async () => {
  // If the order already has a locked tariffRateAtBooking, we use it directly
  if (isLockedTariff.value) return
  const fromId = props.order.fromOffice?.id || props.order.fromOfficeId
  const toId = props.order.toOffice?.id || props.order.toOfficeId
  if (fromId && toId && fromId !== toId) {
    clearRouteTariff()
    await fetchTariffByRoute(fromId, toId)
  }
}

onMounted(async () => {
  await Promise.all([loadTariff(), fetchSettings()])
})

// ─── Formatting ──────────────────────────────────────────────────────────────
const formatAmount = (value?: number | string | null): string => {
  if (value === undefined || value === null || value === '' || value == '0') return '-'
  const num = Number(value)
  return isNaN(num) ? String(value) : num.toLocaleString()
}

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString(
    currentLanguage.value === 'hy' ? 'hy-AM' : currentLanguage.value === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  )
}

// ─── Estimate Submission State (Operator only) ──────────────────────────────
const proposedPriceInput = ref<string>('')
const isSubmittingEstimate = ref<boolean>(false)
const estimateError = ref<string | null>(null)
const estimateSuccessMessage = ref<string | null>(null)

const isProposedPriceValid = computed(() => {
  const val = parseFloat(proposedPriceInput.value)
  return !isNaN(val) && val > 0
})

const previewPriceFromInput = computed<number | null>(() => {
  const val = parseFloat(proposedPriceInput.value)
  if (isNaN(val) || val <= 0) return null
  const weight = chargeableWeight.value
  if (!weight || weight <= 0) return null
  return Math.round(weight * val * 100) / 100
})

const handleSubmitEstimate = async () => {
  if (isSubmittingEstimate.value) return
  estimateError.value = null
  estimateSuccessMessage.value = null

  const priceNum = parseFloat(proposedPriceInput.value)
  if (isNaN(priceNum) || priceNum <= 0) {
    estimateError.value = t('manageOrders.errPositivePriceRequired')
    return
  }

  isSubmittingEstimate.value = true
  try {
    const weight = chargeableWeight.value
    const calculatedPrice = (weight && weight > 0) ? Math.round(weight * priceNum * 100) / 100 : priceNum

    const updated = await ordersService.submitEstimate(props.order.id, {
      estimatedPrice: priceNum,
      price: calculatedPrice
    })

    submittedEstimatePrice.value = priceNum
    estimateSuccessMessage.value = t('manageOrders.estimateSubmittedSuccess')
    proposedPriceInput.value = ''
    emit('updated', updated)
  } catch (err: any) {
    const serverMsg = err?.data?.message || err?.response?._data?.message || err?.message
    estimateError.value = Array.isArray(serverMsg)
      ? serverMsg.join(', ')
      : (typeof serverMsg === 'string' ? serverMsg : 'Failed to submit price estimate.')
  } finally {
    isSubmittingEstimate.value = false
  }
}

// ─── Edit state ──────────────────────────────────────────────────────────────
const isEditing = ref(false)
const isSaving = ref(false)
const editError = ref<string | null>(null)

const editForm = reactive({
  marketName: '',
  productDescription: '',
  productPrice: '',
  currency: 'USD' as OrderCurrency,
  pieceCount: '1',
  isNew: true,
  weight: '',
  length: '',
  width: '',
  height: '',
  tnVedCode: '',
  comment: ''
})

const editErrors = reactive<Record<string, string>>({})

const startEdit = () => {
  // Populate form from order
  editForm.marketName = props.order.marketName || ''
  editForm.productDescription = props.order.productDescription || ''
  editForm.productPrice = props.order.productPrice !== undefined ? String(props.order.productPrice) : ''
  editForm.currency = props.order.currency || 'USD'
  editForm.pieceCount = props.order.pieceCount !== undefined && props.order.pieceCount !== null ? String(props.order.pieceCount) : '1'
  editForm.isNew = props.order.isNew !== undefined ? props.order.isNew : true
  editForm.weight = props.order.weight !== undefined ? String(props.order.weight) : ''
  editForm.length = props.order.length !== undefined ? String(props.order.length) : ''
  editForm.width = props.order.width !== undefined ? String(props.order.width) : ''
  editForm.height = props.order.height !== undefined ? String(props.order.height) : ''
  editForm.tnVedCode = props.order.tnVedCode || ''
  editForm.comment = props.order.comment || ''
  Object.keys(editErrors).forEach(k => delete editErrors[k])
  editError.value = null
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  editError.value = null
  Object.keys(editErrors).forEach(k => delete editErrors[k])
}

// ─── Recalculated price ──────────────────────────────────────────────────────
// When in edit mode, compute a suggested price from the current tariff + form dimensions
const editVolumetricWeight = computed<number | null>(() => {
  if (!isEditing.value) return null
  const l = parseFloat(editForm.length)
  const w = parseFloat(editForm.width)
  const h = parseFloat(editForm.height)
  if (!isNaN(l) && l > 0 && !isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
    return (l * w * h) / volumetricDivisor.value
  }
  return null
})

const recalculatedPrice = computed<number | null>(() => {
  const currentRate = appliedTariffRate.value
  if (!isEditing.value || !currentRate) return null
  const actualW = parseFloat(editForm.weight)
  const volW = editVolumetricWeight.value
  if (isNaN(actualW) || actualW <= 0) return null
  const chargeableW = volW !== null && volW > 0 ? Math.max(actualW, volW) : actualW
  const rate = parseFloat(String(currentRate))
  if (isNaN(rate) || rate <= 0) return null
  return Math.round(chargeableW * rate * 100) / 100
})

// ─── Validation ──────────────────────────────────────────────────────────────
const validate = (): boolean => {
  Object.keys(editErrors).forEach(k => delete editErrors[k])
  let valid = true

  if (!editForm.marketName.trim()) {
    editErrors.marketName = t('orders.errMarketNameRequired')
    valid = false
  }
  if (!editForm.productDescription.trim()) {
    editErrors.productDescription = t('orders.errProductDescriptionRequired')
    valid = false
  }
  const price = parseFloat(editForm.productPrice)
  if (!editForm.productPrice || isNaN(price) || price < 0) {
    editErrors.productPrice = t('orders.errProductPriceRequired')
    valid = false
  }
  const pieces = Number(editForm.pieceCount)
  if (!editForm.pieceCount || isNaN(pieces) || pieces < 1 || !Number.isInteger(pieces)) {
    editErrors.pieceCount = t('orders.errPieceCountRequired')
    valid = false
  }
  const weight = parseFloat(editForm.weight)
  if (!editForm.weight || isNaN(weight) || weight < 0) {
    editErrors.weight = t('orders.errWeightRequired')
    valid = false
  }
  const length = parseFloat(editForm.length)
  if (!editForm.length || isNaN(length) || length < 0) {
    editErrors.length = t('orders.errLengthRequired')
    valid = false
  }
  const width = parseFloat(editForm.width)
  if (!editForm.width || isNaN(width) || width < 0) {
    editErrors.width = t('orders.errWidthRequired')
    valid = false
  }
  const height = parseFloat(editForm.height)
  if (!editForm.height || isNaN(height) || height < 0) {
    editErrors.height = t('orders.errHeightRequired')
    valid = false
  }

  return valid
}

// ─── Submit ──────────────────────────────────────────────────────────────────
const handleSave = async () => {
  if (isSaving.value) return
  if (!validate()) return

  isSaving.value = true
  editError.value = null

  try {
    const formData = new FormData()
    formData.append('marketName', editForm.marketName.trim())
    formData.append('productDescription', editForm.productDescription.trim())
    formData.append('productPrice', String(parseFloat(editForm.productPrice)))
    formData.append('currency', editForm.currency)
    formData.append('pieceCount', String(parseInt(editForm.pieceCount, 10)))
    formData.append('isNew', String(editForm.isNew))
    formData.append('weight', String(parseFloat(editForm.weight)))
    formData.append('length', String(parseFloat(editForm.length)))
    formData.append('width', String(parseFloat(editForm.width)))
    formData.append('height', String(parseFloat(editForm.height)))
    formData.append('tnVedCode', editForm.tnVedCode.trim())
    formData.append('comment', editForm.comment.trim())

    // Include recalculated shipping price if available
    if (recalculatedPrice.value !== null) {
      formData.append('price', String(recalculatedPrice.value))
    }

    const baseUrl = getApiUrl()
    const headers: Record<string, string> = {}
    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${baseUrl}/orders/${props.order.id}`, {
      method: 'PATCH',
      headers,
      body: formData
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      const msg = errBody?.message
      editError.value = Array.isArray(msg)
        ? msg.join(', ')
        : (typeof msg === 'string' ? msg : 'Failed to update order.')
      return
    }

    const updatedOrder: Order = await response.json()
    isEditing.value = false
    emit('updated', updatedOrder)
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || 'Failed to update order.'
    editError.value = Array.isArray(msg) ? msg.join(', ') : String(msg)
  } finally {
    isSaving.value = false
  }
}
</script>
