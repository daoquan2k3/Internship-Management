package pka.edu.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapperImpl;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ValidDateRangeValidator implements ConstraintValidator<ValidDateRange, Object> {
    private String startDateField;
    private String endDateField;
    private String message;

    @Override
    public void initialize(ValidDateRange annotation) {
        this.startDateField = annotation.startDateField();
        this.endDateField = annotation.endDateField();
        this.message = annotation.message();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        try {
            BeanWrapperImpl beanWrapper = new BeanWrapperImpl(value);
            Object startDateObj = beanWrapper.getPropertyValue(startDateField); // lấy giá trị các field theo tên
            Object endDateObj = beanWrapper.getPropertyValue(endDateField); // lấy giá trị các field theo tên

            // Nếu một trong hai null, skip validation
            if (startDateObj == null || endDateObj == null) {
                return true;
            }

            // Chuyển đổi và so sánh
            boolean isValid = compareDate(startDateObj, endDateObj);

            if (!isValid) {
                context.disableDefaultConstraintViolation(); // xóa message mặc định
                context.buildConstraintViolationWithTemplate(message)
                       .addPropertyNode(startDateField)
                       .addConstraintViolation(); // thêm lỗi cho cả 2 trường với message mac dinh
                
                context.buildConstraintViolationWithTemplate("End date must be after start date")
                       .addPropertyNode(endDateField)
                       .addConstraintViolation();
            }

            return isValid;
        } catch (Exception e) {
            return true;
        }
    }

    private boolean compareDate(Object startDateObj, Object endDateObj) {
        if (startDateObj instanceof LocalDate && endDateObj instanceof LocalDate) {
            LocalDate startDate = (LocalDate) startDateObj;
            LocalDate endDate = (LocalDate) endDateObj;
            return !startDate.isAfter(endDate);
        }
        
        if (startDateObj instanceof LocalDateTime && endDateObj instanceof LocalDateTime) {
            LocalDateTime startDate = (LocalDateTime) startDateObj;
            LocalDateTime endDate = (LocalDateTime) endDateObj;
            return !startDate.isAfter(endDate);
        }

        return true;
    }
}

