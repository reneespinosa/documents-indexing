from tortoise import fields, models

class Document(models.Model):
    id = fields.UUIDField(pk=True)
    title = fields.CharField(max_length=255)
    content = fields.TextField()  # This will store the Base64 string of the original file
    extracted_text = fields.TextField(null=True) # This will store the text extracted from the file
    word_count = fields.IntField()
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "documents"
