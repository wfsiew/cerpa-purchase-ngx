export class AppConstant {

  public static PAGE_SIZE = 10;
  public static LOOK_UP_PAGE_SIZE = 5;
  public static SNACKBAR_DURATION = 3000;

  /** the time out increased due to time out errors from 12000 to 16000 */
  public static NETWORK_TIME_OUT = 16000;
  // HTTP Headers
  public static HTTP_HEADER = {
    LINK: 'link',
    X_TOTAL_COUNT: 'x-total-count'
  };
  // ROLES
  public static ROLE = {
    VENDOR: 'ROLE_VENDOR',
    PURCHASER: 'ROLE_PURCHASING_STAFF',
    ROLE_PRODUCT_MANAGER: 'ROLE_PRODUCT_MANAGER',
    ROLE_PRODUCT_COORDINATOR: 'ROLE_PRODUCT_COORDINATOR',
    ROLE_STOCK_OBSERVER: 'ROLE_STOCK_OBSERVER'
  };

  public static ERROR_CODE_URL: String = 'purchase.vendor.invite.error.error_code';

  public static VALIDATE_INPUT_BORDER = {
    VALID: 'valid-input',
    IN_VALID: 'in-valid-input'
  };
  public static DEFAULT_ICONS = {
    USER_ICON: 'assets/images/default-m-icon/product-icon.png',
  };
  public static LAST_STEP = {
    STEP1 : 0,
    STEP2 : 1
  };

  public static VENDOR_STATUS = {
    INVITED: 3,
    BLACKLISTED: 2,
    ACTIVATED: 1
  };

  public static TAX_SCHEME = {
    TAX_INCLUSIVE: 0,
    TAXABLE: 1,
    NON_TAXABLE: 2
  };

  public static PR_STATUS = {
    IN_PROGRESS: 0,
    ISSUED_PO: 1,
    DELIVERED: 2,
    COMPLETED: 3,
    CANCELLED: 4
  };

  public static PO_STATUS = {
    PENDING: 0,
    NEW: 1,
    IN_PROGRESS: 2,
    DELIVERING: 3,
    DELIVERED: 4,
    COMPLETED: 5,
    CANCELLED: 6,
    REJECTED: 7
  };

  public static DO_STATUS = {
    NEW: 0,
    DELIVERING: 1,
    DELIVERED: 2,
    COMPLETED: 3
  };

  public static ERROR_CODE = {
    undefined: 'undefined',
    1: '1',
    2: '1',
    3: '2',
    4: '3',
    5: '4',
    6: '5',
    7: '6',
    GEN_0001: 'GEN_0001', // login failed
    GEN_0002: 'GEN_0002', // Minimum length of 8
    GEN_0003: 'GEN_0003', // Not common password
    GEN_0004: 'GEN_0004', // Not similar with the username
    GEN_0005: 'GEN_0005', // Combination of alphanumeric and special char (spaces not allowed)
    GEN_0006: 'GEN_0006', // Activation Link has expired
    GEN_0007: 'GEN_0007', // Form validation failed
    GEN_0008: 'GEN_0008', // Upload failed
    GEN_0009: 'GEN_0009', // Password dose not matched
    VND_0034: 'VND_0034',
    VND_0001: 'VND_0001', // The email address has already exist.
    VND_0002: 'VND_0002', // Vendor profile does not exist
    VND_0003: 'VND_0003', // Failed blacklist vendor.
    VND_0004: 'VND_0004', // Failed delete vendor.
    VND_0005: 'VND_0005', // Failed re-invite vendor.
    VND_0006: 'VND_0006', // Password already set
    VND_0007: 'VND_0007', // Create vendor failed
    VND_0008: 'VND_0008', // Create product pricing failed"
    VND_0009: 'VND_0009', // Update product pricing failed
    VND_0010: 'VND_0010', // Vendor product does not exist
    VND_0011: 'VND_0011', // Delete vendor product failed
    VND_0012: 'VND_0012', // Issue purchase request failed
    VND_0013: 'VND_0013', // Update purchase request failed
    VND_0014: 'VND_0014', // Purchase request does not exist
    VND_0015: 'VND_0015', // Cancel purchase request failed
    VND_0016: 'VND_0016', // Material does not exist
    VND_0017: 'VND_0017', // PO already issued
    VND_0018: 'VND_0018', // Vendor detail not exist
    VND_0019: 'VND_0019', // Issue purchase order fail
    VND_0020: 'VND_0020', // Total price mismatch in issue purchase order
    VND_0021: 'VND_0021', // Purchase order not exist
    VND_0022: 'VND_0022', // Product tier pricing not exist
    VND_0023: 'VND_0023', // Product promotion pricing not exist
    VND_0024: 'VND_0024', // Vendor contact person not exist
    VND_0025: 'VND_0025', // Cancel purchase order failed
    VND_0026: 'VND_0026', // Accept purchase order failed
    VND_0027: 'VND_0027', // Reject purchase order failed
    VND_0028: 'VND_0028', // Issue delivery order fail
    VND_0029: 'VND_0029', // Invoice already issued
    VND_0030: 'VND_0030', // Notifications empty
    VND_0031: 'VND_0031', // Delivery order does not exist
    VND_0032: 'VND_0032', // Invoice does not exist
    VND_0033: 'VND_0033', // Delivery order not complete

    ADM_0001: 'ADM_0001', // reset password: invalid activation code
    ADM_0002: 'ADM_0002', // reset password: no reset password request
    ADM_0003: 'ADM_0003', // reset password: unknown error
    ADM_0004: 'ADM_0004', // change password: unknown error

  };

  public static CUSTOM_VALIDATIONS = {
    EMAIL: /^[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9\u007F-\uffff!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/, // done
    COMPANY_NAME: /^(?!([Sdn.]+[ ]))+(?!([Bhd]+[ ]))+(?!([Berhad]+[ ]))+(?!([Sendirian]+[ ]))+[a-zA-Z, & ]+(([', .-][a-zA-Z])?[a-zA-Z]\w*)*$/, // not confirm yet 
    CONTACT_PERSON: /^[a-zA-Z]+(([', .-][a-zA-Z ])?[a-zA-Z]*)*$/, // not confirm yet
    PHONE_NO: /^[+]?6?0(3[\s\-]?[2-9]\d{3}\s?\d{4}|[4-7][\s\-]?[2-9]\d{2}\s?\d{4}|8[1-9][\s\-]?[2-9]\d{1}\s?\d{4}|9[\s\-]?[2-9]\d{2}\s?\d{4}|(1(0|[2-4]|[6-9]|1[1-9]?))[\s\-]?[1-9]\d{2}\s?\d{4})$/, // done
    OFFICE_NO: /^[+]?6?0(3[\s\-]?[2-9]\d{3}\s?\d{4}|[4-7][\s\-]?[2-9]\d{2}\s?\d{4}|8[1-9][\s\-]?[2-9]\d{1}\s?\d{4}|9[\s\-]?[2-9]\d{2}\s?\d{4}|(1(0|[2-4]|[6-9]|1[1-9]?))[\s\-]?[1-9]\d{2}\s?\d{4})$/, // done
    BUSINESS_REGI_NO: /^([A-Z]{2}\d{7}-[A-Z])|(\d{6,}-[A-Z])|(LLP\d{7}-[A-Z]{3})$/, // done
    TAX_NO: /^[A-Z]{3}-\d{4}-\d{6}/, // 8 temp 3
    FAX_NO: /^[+]?6?0(3[\s\-]?[2-9]\d{3}\s?\d{4}|[4-7][\s\-]?[2-9]\d{2}\s?\d{4}|8[1-9][\s\-]?[2-9]\d{1}\s?\d{4}|9[\s\-]?[2-9]\d{2}\s?\d{4}|(1(0|[2-4]|[6-9]|1[1-9]?))[\s\-]?[1-9]\d{2}\s?\d{4})$/, // done 
    ADDRESS_LINE1: /[A-Za-z0-9\-\\,.]+/, // done
    ADDRESS_LINE2: /[A-Za-z0-9\-\\,.]+/, // done  255
    ADDRESS_LINE3: /[A-Za-z0-9\-\\,.]+/, // done  255
    POST_CODE: /^\d{5}$/, // done
    BANK: /(^\d{5,17}$)/, // not yet
    ACCOUNT_NO: /^\d{5,17}$/, // done,
    PASSWORD_VALIDATION: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    SPACE: /^[\w+\s]+[\w][\S]/,
    PRICE: /^\d+(?:\.\d{0,2})?$/,
    DATE: /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/,
    QTY: /^[1-9]/,
  };
}

// ^([a-z]{2}\d{7}-[a-z])$
// Pengurusan Danaharta Nasional Berhad(now managed under Prokhas Sdn. Bd.)

/**
 * @see ^([0-9]{4}([-]{1})([A-Z]{2}))
 * @see ^((?![e])[a-z])+$ match everythings except e
 */
