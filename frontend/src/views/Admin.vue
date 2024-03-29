<template>
  <v-container>
    <v-row>
      <v-col class="text-left">
        <h2 class="headline mb-2">Admin Dashboard</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-center">
        <h2 class="headline mb-2">Pending Transactions</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loadingTransactions"
          :loading-text="'Loading Transactions'">

          <template v-slot:item="{ item }">
            <tr>
              <td>
                {{ item.description }}
              </td>

              <td>
                <v-chip :color="formatTypeColor(item.type)">
                  {{ formatCurrency(item.amount) }}
                </v-chip>
              </td>

              <td>
                  {{ formatTypeText(item.type) }}
              </td>

              <td>
                <v-chip :color="formatStatusColor(item.status)">
                  {{ formatStatusText(item.status) }}
                </v-chip>
              </td>

              <td>
                {{ formatDate(item.created_at) }}
              </td>

              <td>
                <v-icon 
                  class="me-2 pl-6"
                  @click="adminStore.prepareApprovalDialog(true, item.id)"
                >
                  mdi-eye
                </v-icon>
              </td>

            </tr>
          </template>

          <template v-slot:bottom>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <div class="text-center">
          <v-tooltip text="Previous Page">
            <template v-slot:activator="{ props }">
              <v-btn @click="fetchTransactions(currentPage - 1)" :disabled="!hasPreviousPage" variant="text" icon="mdi-arrow-left-bold"  v-bind="props"></v-btn>
            </template>
          </v-tooltip>

          <v-tooltip text="Next Page">
            <template v-slot:activator="{ props }">
              <v-btn @click="fetchTransactions(currentPage + 1)" :disabled="!hasNextPage" variant="text" icon="mdi-arrow-right-bold"  v-bind="props"></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>

    <approval-dialog></approval-dialog>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { DEPOSIT } from '@/utils/transactions/transactionTypes.js';
import { PENDING } from '@/utils/transactions/transactionStatuses.js';
import { useTransactionStore } from '@/store/transaction';
import { useAdminStore } from '@/store/admin';
import ApprovalDialog from '@/components/ApprovalDialog.vue';
import transactionService from '@/services/transactionService';

import { 
  formatTypeText,
  formatTypeColor,
  formatStatusText,
  formatStatusColor,
  formatCurrency,
  formatDate
} from '@/utils/formatters.js';

const transactionStore = useTransactionStore();
const adminStore = useAdminStore();

const { currentPage } = storeToRefs(transactionStore);
const { approvalDialog, refreshAdmin } = storeToRefs(adminStore);

const items = ref([]);
const loadingTransactions = ref(false);

const hasNextPage = ref(false);
const hasPreviousPage = ref(false);

const headers = [
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Amount', key: 'amount', sortable: false },
  { title: 'Type', key: 'type', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Date', key: 'created_at', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false },
];

const filters = {
  status: PENDING,
  type: DEPOSIT
};

const fetchTransactions = async (page) => {
  loadingTransactions.value = true;

  await transactionService.get(page, filters).then(res => {
    items.value = res.data;

    transactionStore.setCurrentPage(res.currentPage);
    res.nextPage ? (hasNextPage.value = true) : (hasNextPage.value = false);
    res.prevPage ? (hasPreviousPage.value = true) : (hasPreviousPage.value = false);
  })
  .catch(() => {
    console.error('error');
  })
  .finally(() => {
    loadingTransactions.value = false;
  });
};

onMounted(async () => {
  fetchTransactions(currentPage.value)
});

watch(refreshAdmin, (newValue) => {
  if (newValue) {
    fetchTransactions(currentPage.value)
    adminStore.setRefreshAdmin(false);
  }
});
</script>