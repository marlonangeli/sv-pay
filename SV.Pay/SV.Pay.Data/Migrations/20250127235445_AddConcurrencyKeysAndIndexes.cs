using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SV.Pay.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddConcurrencyKeysAndIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_transactions_accounts_related_account_id",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_account_id",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_related_account_id",
                table: "transactions");

            migrationBuilder.CreateIndex(
                name: "ix_transactions_account_id_date",
                table: "transactions",
                columns: new[] { "account_id", "date" })
                .Annotation("SqlServer:Include", new[] { "amount", "type" });

            migrationBuilder.CreateIndex(
                name: "ix_transactions_related_account_id_date",
                table: "transactions",
                columns: new[] { "related_account_id", "date" },
                filter: "[related_account_id] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "fk_transactions_accounts_related_account_id",
                table: "transactions",
                column: "related_account_id",
                principalTable: "accounts",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_transactions_accounts_related_account_id",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_account_id_date",
                table: "transactions");

            migrationBuilder.DropIndex(
                name: "ix_transactions_related_account_id_date",
                table: "transactions");

            migrationBuilder.CreateIndex(
                name: "ix_transactions_account_id",
                table: "transactions",
                column: "account_id");

            migrationBuilder.CreateIndex(
                name: "ix_transactions_related_account_id",
                table: "transactions",
                column: "related_account_id");

            migrationBuilder.AddForeignKey(
                name: "fk_transactions_accounts_related_account_id",
                table: "transactions",
                column: "related_account_id",
                principalTable: "accounts",
                principalColumn: "id");
        }
    }
}
