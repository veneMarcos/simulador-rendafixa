(
  function () {

    function handleSimulate (e) {
      e.preventDefault()
      const URL_API_SIMULATOR = 'https://easynvestsimulatorcalcapi.azurewebsites.net/calculator/simulate'

      const investedAmount = document.querySelector('input[name=investedAmount]').value
      const maturityDate = document.querySelector('input[name=maturityDate]').value
      const rate = document.querySelector('input[name=rate]').value

      const parseDate = date => date.split('/').reverse().join('-')

      axios.get(URL_API_SIMULATOR, {
        params: {
          investedAmount: investedAmount.replace(/\./g, '').replace(/\,/g, '.').replace('R$', '').trim(),
          index: 'CDI',
          rate: rate.replace(/\,/g, '.').replace('%', '').trim(),
          isTaxFree: false,
          maturityDate:  parseDate(maturityDate)
        }
      })
        .then(response => {
          document.querySelector('.iz-box.simulation').classList.remove('active')
          document.querySelector('.iz-box.result').classList.add('active')

          document.querySelector('input[name=investedAmount]').value = ''
          document.querySelector('input[name=maturityDate]').value = ''
          document.querySelector('input[name=rate]').value = ''

          fillSimulate(response.data)

        })
        .catch(response => console.error(response))
    }

    function fillSimulate(fields) {
      const MASK = {
        MONEY: value => `${value.toString().replace('.', ',')}`,
        PERCENTAGE: value => `(${value.toString().replace('.', ',')}%)`,
        DATE: convertDate   // TODO: MELHORAR TRATAMENTO DE DATAS
      }
      
      const fillField = (fieldName, value) => {
        document
          .querySelectorAll(`[data-attr="${fieldName}"]`)
          .forEach(e => { e.textContent = value; })
      }
      
      const fieldsToFill = [
        {
          fieldName: 'grossAmount',
          value: MASK.MONEY(fields.grossAmount)
        },
        {
          fieldName: 'grossAmountProfit',
          value: MASK.MONEY(fields.grossAmountProfit)
        },
        {
          fieldName: 'investedAmount',
          value: MASK.MONEY(fields.investmentParameter.investedAmount)
        },
        {
          fieldName: 'grossAmount',
          value: MASK.MONEY(fields.grossAmount)
        },
        {
          fieldName: 'grossAmountProfit',
          value: MASK.MONEY(fields.grossAmountProfit)
        },
        {
          fieldName: 'taxesAmount',
          value: MASK.MONEY(fields.taxesAmount)
        },
        {
          fieldName: 'taxesRate',
          value: MASK.PERCENTAGE(fields.taxesRate)
        },
        {
          fieldName: 'netAmount',
          value: MASK.MONEY(fields.netAmount)
        },
        {
          fieldName: 'maturityDate',
          value: MASK.DATE(fields.investmentParameter.maturityDate)
        },
        {
          fieldName: 'maturityTotalDays',
          value: MASK.MONEY(fields.investmentParameter.maturityTotalDays)
        },
        {
          fieldName: 'monthlyGrossRateProfit',
          value: MASK.MONEY(fields.monthlyGrossRateProfit)
        },
        {
          fieldName: 'rate',
          value: MASK.MONEY(fields.investmentParameter.rate)
        },
        {
          fieldName: 'annualGrossRateProfit',
          value: MASK.MONEY(fields.annualGrossRateProfit)
        },
        {
          fieldName: 'rateProfit',
          value: MASK.MONEY(fields.rateProfit)
        }
      ]

      fieldsToFill
        .forEach(field => {
          fillField(field.fieldName, field.value)
        })
    }

    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s }
      let d = new Date(inputFormat)
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/')
    }

    function init() {

      let today = document.querySelector('span[data-attr="today"]')
      today.appendChild(document.createTextNode(convertDate(new Date())))

      document.querySelector('.iz-btn-simular').addEventListener('click', handleSimulate)

      document.querySelector('.iz-btn-again').addEventListener('click', function(){
        document.querySelector('.iz-box.simulation').classList.add('active')
        document.querySelector('.iz-box.result').classList.remove('active')
      })

      vanillaTextMask.maskInput({
        inputElement: document.querySelector('input[name=investedAmount]'),
        mask: createNumberMask.default({
          prefix: 'R$ ',
          thousandsSeparatorSymbol: '.',
          decimalSymbol: ',',
          allowDecimal: true,
          integerLimit: 7
        })
      })

      vanillaTextMask.maskInput({
        inputElement: document.querySelector('input[name=maturityDate]'),
        mask: [ /\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/ ],
        guide: false
      })

      vanillaTextMask.maskInput({
        inputElement: document.querySelector('input[name=rate]'),
        mask: createNumberMask.default({
          prefix: '',
          suffix: '%',
          thousandsSeparatorSymbol: '.',
          decimalSymbol: ',',
          allowDecimal: true,
          integerLimit: 3
        })
      })
    }

    init()
  }
)()
