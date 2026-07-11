import { defineStore } from "pinia";
import { computed } from "vue";
import { Utils } from "hs-admin-ui";

export interface DictionaryItem {
  id: number;
  type: string;
  label: string;
  value: string;
  sort_order: number;
}

export const useDictionaryStore = defineStore("dictionary", () => {
  const dictionaries = computed({
    get: () => JSON.parse(localStorage.getItem("DICTIONARIES") || "{}"),
    set: (val) => localStorage.setItem("DICTIONARIES", JSON.stringify(val))
  });
  const dictionariesClass = computed(() => {
    return Object.keys(dictionaries.value).map((key) => ({
      label: key,
      value: key
    }));
  });

  const fetchDictionaries = async () => {
    return Utils.useRequest("/sf-web/dictionary", {}, "get").then((res) => {
      dictionaries.value = res.data;
      return res.data;
    });
  };

  const getDictionary = (key: string) => {
    return dictionaries.value[key] || [];
  };

  const addDictionary = async (data: Omit<DictionaryItem, "id">) => {
    return Utils.useRequest("/sf-web/dictionary", data, "post");
  };

  const updateDictionary = async (id: number, data: Partial<Omit<DictionaryItem, "id">>) => {
    return Utils.useRequest(`/sf-web/dictionary/${id}`, data, "put");
  };

  const deleteDictionary = async (id: number) => {
    return Utils.useRequest(`/sf-web/dictionary/${id}`, {}, "delete");
  };

  return { dictionaries, dictionariesClass, fetchDictionaries, getDictionary, addDictionary, updateDictionary, deleteDictionary };
});
