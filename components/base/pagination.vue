<template>
  <div class="grid md:grid-cols-2 gap-2">
    <div>
      <ul class="pagination">
        <li>
          <a class="pagination__link" href="">
            <ChevronsLeftIcon class="w-4 h-4" />
          </a>
        </li>
        <li>
          <a class="pagination__link" href="">
            <ChevronLeftIcon class="w-4 h-4" />
          </a>
        </li>
        <li>
          <a class="pagination__link" href="">...</a>
        </li>
        <li>
          <a class="pagination__link" href="">1</a>
        </li>
        <li>
          <a class="pagination__link pagination__link--active" href="">2</a>
        </li>
        <li>
          <a class="pagination__link" href="">3</a>
        </li>
        <li>
          <a class="pagination__link" href="">...</a>
        </li>
        <li>
          <a class="pagination__link" href="">
            <ChevronRightIcon class="w-4 h-4" />
          </a>
        </li>
        <li>
          <a class="pagination__link" href="">
            <ChevronsRightIcon class="w-4 h-4" />
          </a>
        </li>
      </ul>
    </div>
    <div class="text-right">
      <select class="w-20 form-select box mt-3 sm:mt-0">
        <option>10</option>
        <option>25</option>
        <option>35</option>
        <option>50</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentpage: {
      default: 1
    }
  },
  name: 'Pagination',
};
</script>
