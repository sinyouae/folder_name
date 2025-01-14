import utils from './utils';

/* -------------------------------------------------------------------------- */
/*                                 Data Table                                 */
/* -------------------------------------------------------------------------- */

const togglePaginationButtonDisable = (button, disabled) => {
  button.disabled = disabled;
  button.classList[disabled ? 'add' : 'remove']('disabled');
};

const listInit = () => {
  if (window.List) {
    const lists = document.querySelectorAll('[data-list]');

    if (lists.length) {
      lists.forEach(el => {
        const bulkSelect = el.querySelector('[data-bulk-select]');
        let options = utils.getData(el, 'list');

        if (options.pagination) {
          options = {
            ...options,
            pagination: {
              item: "<li><button class='page' type='button'></button></li>",
              ...options.pagination
            }
          };
        }

        const paginationButtonNext = el.querySelector('[data-list-pagination="next"]');
        const paginationButtonPrev = el.querySelector('[data-list-pagination="prev"]');
        const viewAll = el.querySelector('[data-list-view="*"]');
        const viewLess = el.querySelector('[data-list-view="less"]');
        const listInfo = el.querySelector('[data-list-info]');
        const listFilters = document.querySelectorAll('[data-list-filter]');
        const list = new window.List(el, options);

        //-------fallback-----------

        list.on('updated', item => {
          const fallback =
            el.querySelector('.fallback') || document.getElementById(options.fallback);

          if (fallback) {
            if (item.matchingItems.length === 0) {
              fallback.classList.remove('d-none');
            } else {
              fallback.classList.add('d-none');
            }
          }
        });

        // ---------------------------------------

        const totalItem = list.items.length;
        const itemsPerPage = list.page;
        const btnDropdownClose = list.listContainer.querySelector('.btn-close');
        let pageQuantity = Math.ceil(totalItem / itemsPerPage);
        let numberOfcurrentItems = list.visibleItems.length;
        let pageCount = 1;

        btnDropdownClose &&
          btnDropdownClose.addEventListener('search.close', () => {
            list.fuzzySearch('');
          });

        const updateListControls = () => {
          listInfo && (listInfo.innerHTML = `${list.i} to ${numberOfcurrentItems} of ${totalItem}`);
          paginationButtonPrev &&
            togglePaginationButtonDisable(paginationButtonPrev, pageCount === 1);
          paginationButtonNext &&
            togglePaginationButtonDisable(paginationButtonNext, pageCount === pageQuantity);

          if (pageCount > 1 && pageCount < pageQuantity) {
            togglePaginationButtonDisable(paginationButtonNext, false);
            togglePaginationButtonDisable(paginationButtonPrev, false);
          }
        };

        // List info
        updateListControls();

        if (paginationButtonNext) {
          paginationButtonNext.addEventListener('click', e => {
            e.preventDefault();
            pageCount += 1;

            const nextInitialIndex = list.i + itemsPerPage;
            nextInitialIndex <= list.size() && list.show(nextInitialIndex, itemsPerPage);
            numberOfcurrentItems += list.visibleItems.length;
            updateListControls();
          });
        }

        if (paginationButtonPrev) {
          paginationButtonPrev.addEventListener('click', e => {
            e.preventDefault();
            pageCount -= 1;

            numberOfcurrentItems -= list.visibleItems.length;
            const prevItem = list.i - itemsPerPage;
            prevItem > 0 && list.show(prevItem, itemsPerPage);
            updateListControls();
          });
        }

        const toggleViewBtn = () => {
          viewLess.classList.toggle('d-none');
          viewAll.classList.toggle('d-none');
        };

        if (viewAll) {
          viewAll.addEventListener('click', () => {
            list.show(1, totalItem);
            pageQuantity = 1;
            pageCount = 1;
            numberOfcurrentItems = totalItem;
            updateListControls();
            toggleViewBtn();
          });
        }
        if (viewLess) {
          viewLess.addEventListener('click', () => {
            list.show(1, itemsPerPage);
            pageQuantity = Math.ceil(totalItem / itemsPerPage);
            pageCount = 1;
            numberOfcurrentItems = list.visibleItems.length;
            updateListControls();
            toggleViewBtn();
          });
        }
        // numbering pagination
        if (options.pagination) {
          el.querySelector('.pagination').addEventListener('click', e => {
            if (e.target.classList[0] === 'page') {
              pageCount = Number(e.target.innerText);
              updateListControls();
            }
          });
        }
        if (listFilters) {
          listFilters.forEach(listFilter => {
            listFilter.addEventListener('change', () => {
              const activeFilters = {};

              listFilters.forEach(filter => {
                const key = filter.getAttribute('data-list-filter');
                const value = filter.value.trim().toLowerCase();
                if (value) {
                  activeFilters[key] = value;
                }
              });
              list.filter(item =>
                Object.keys(activeFilters).every(key => {
                  const itemValue = item.values()[key].toLowerCase();
                  return itemValue.includes(activeFilters[key]);
                })
              );
            });
          });
        }

        //bulk-select
        if (bulkSelect) {
          const bulkSelectInstance = window.BulkSelect.getInstance(bulkSelect);
          bulkSelectInstance.attachRowNodes(
            list.items.map(item => item.elm.querySelector('[data-bulk-select-row]'))
          );

          bulkSelect.addEventListener('change', () => {
            if (list) {
              if (bulkSelect.checked) {
                list.items.forEach(item => {
                  item.elm.querySelector('[data-bulk-select-row]').checked = true;
                });
              } else {
                list.items.forEach(item => {
                  item.elm.querySelector('[data-bulk-select-row]').checked = false;
                });
              }
            }
          });
        }
      });
    }
  }
};

export default listInit;
