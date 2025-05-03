
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Calendar, 
  DollarSign, 
  User, 
  Clock,
  ChevronRight,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  FileText,
  Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CreditRecord, CreditPayment, Customer } from "@/types/product";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uploadFile } from "@/utils/storage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Badge
} from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import AuthGuard from "@/components/AuthGuard";

const Billing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creditRecords, setCreditRecords] = useState<CreditRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<CreditRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewPaymentsOpen, setIsViewPaymentsOpen] = useState(false);
  const [isSendReminderOpen, setIsSendReminderOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<CreditRecord | null>(null);
  const [currentPayments, setCurrentPayments] = useState<CreditPayment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Form states
  const [newRecord, setNewRecord] = useState({
    customerId: "",
    initialAmount: 0,
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    notes: ""
  });

  const [newPayment, setNewPayment] = useState<Omit<CreditPayment, "id" | "credit_record_id">>({
    amount: 0,
    payment_method: "cash",
    payment_date: format(new Date(), "yyyy-MM-dd"),
    notes: ""
  });

  const [paymentReceiptFile, setPaymentReceiptFile] = useState<File | null>(null);

  // Fetch credit records and customers from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .order('name');

        if (customersError) throw customersError;
        setCustomers(customersData || []);

        // Fetch credit records with customer info
        const { data: recordsData, error: recordsError } = await supabase
          .from('credit_records')
          .select(`
            *,
            customer:customer_id (
              id,
              name,
              email,
              phone
            )
          `)
          .order('created_at', { ascending: false });

        if (recordsError) throw recordsError;
        setCreditRecords(recordsData || []);
        setFilteredRecords(recordsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter records based on search query and status
  useEffect(() => {
    let filtered = creditRecords;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record => 
        record.customer?.name.toLowerCase().includes(query) || 
        record.id.toLowerCase().includes(query) ||
        (record.notes && record.notes.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(record => record.status === filterStatus);
    }

    setFilteredRecords(filtered);
  }, [searchQuery, filterStatus, creditRecords]);

  // Handle adding a new credit record
  const handleAddRecord = async () => {
    try {
      setLoading(true);

      if (!newRecord.customerId) {
        toast.error("Please select a customer");
        return;
      }

      if (newRecord.initialAmount <= 0) {
        toast.error("Amount must be greater than zero");
        return;
      }

      const { data: record, error } = await supabase
        .from('credit_records')
        .insert({
          customer_id: newRecord.customerId,
          initial_amount: newRecord.initialAmount,
          remaining_amount: newRecord.initialAmount,
          due_date: newRecord.dueDate,
          status: 'unpaid',
          notes: newRecord.notes
        })
        .select(`
          *,
          customer:customer_id (
            id,
            name,
            email,
            phone
          )
        `)
        .single();

      if (error) throw error;

      setCreditRecords([record, ...creditRecords]);
      setFilteredRecords([record, ...filteredRecords]);
      setIsAddDialogOpen(false);
      setNewRecord({
        customerId: "",
        initialAmount: 0,
        dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        notes: ""
      });
      toast.success("Credit record added successfully");
    } catch (error) {
      console.error("Error adding credit record:", error);
      toast.error("Failed to add credit record");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a credit record
  const handleUpdateRecord = async () => {
    if (!currentRecord) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('credit_records')
        .update({
          due_date: currentRecord.due_date,
          notes: currentRecord.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentRecord.id);

      if (error) throw error;

      const updatedRecords = creditRecords.map(record =>
        record.id === currentRecord.id ? currentRecord : record
      );
      setCreditRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setIsEditDialogOpen(false);
      toast.success("Credit record updated successfully");
    } catch (error) {
      console.error("Error updating credit record:", error);
      toast.error("Failed to update credit record");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a credit record
  const handleDeleteRecord = async () => {
    if (!currentRecord) return;

    try {
      setLoading(true);

      // Delete related payments first
      const { error: paymentsError } = await supabase
        .from('credit_payments')
        .delete()
        .eq('credit_record_id', currentRecord.id);

      if (paymentsError) throw paymentsError;

      // Then delete the credit record
      const { error } = await supabase
        .from('credit_records')
        .delete()
        .eq('id', currentRecord.id);

      if (error) throw error;

      const updatedRecords = creditRecords.filter(record => record.id !== currentRecord.id);
      setCreditRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setIsDeleteDialogOpen(false);
      toast.success("Credit record deleted successfully");
    } catch (error) {
      console.error("Error deleting credit record:", error);
      toast.error("Failed to delete credit record");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a payment
  const handleAddPayment = async () => {
    if (!currentRecord) return;

    try {
      setLoading(true);

      if (newPayment.amount <= 0) {
        toast.error("Payment amount must be greater than zero");
        return;
      }

      if (newPayment.amount > currentRecord.remaining_amount) {
        toast.error("Payment amount cannot exceed the remaining balance");
        return;
      }

      // Upload receipt if provided
      let receipt_url = undefined;
      if (paymentReceiptFile) {
        receipt_url = await uploadFile(paymentReceiptFile, 'receipt_images');
      }

      // Add payment record
      const { data: payment, error: paymentError } = await supabase
        .from('credit_payments')
        .insert({
          credit_record_id: currentRecord.id,
          amount: newPayment.amount,
          payment_method: newPayment.payment_method,
          payment_date: newPayment.payment_date,
          notes: newPayment.notes,
          receipt_url
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update the credit record
      const newRemainingAmount = currentRecord.remaining_amount - newPayment.amount;
      const newStatus = newRemainingAmount <= 0 ? 'paid' : 'partial';

      const { data: updatedRecord, error: recordError } = await supabase
        .from('credit_records')
        .update({
          remaining_amount: newRemainingAmount,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentRecord.id)
        .select(`
          *,
          customer:customer_id (
            id,
            name,
            email,
            phone
          )
        `)
        .single();

      if (recordError) throw recordError;

      // Update the state
      const updatedRecords = creditRecords.map(record =>
        record.id === currentRecord.id ? updatedRecord : record
      );
      setCreditRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setIsPaymentDialogOpen(false);
      setNewPayment({
        amount: 0,
        payment_method: "cash",
        payment_date: format(new Date(), "yyyy-MM-dd"),
        notes: ""
      });
      setPaymentReceiptFile(null);

      toast.success("Payment recorded successfully");
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  // Load payments for a specific credit record
  const loadPayments = async (record: CreditRecord) => {
    try {
      setLoading(true);
      setCurrentRecord(record);

      const { data: payments, error } = await supabase
        .from('credit_payments')
        .select('*')
        .eq('credit_record_id', record.id)
        .order('payment_date', { ascending: false });

      if (error) throw error;

      setCurrentPayments(payments || []);
      setIsViewPaymentsOpen(true);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  // Handle sending a reminder
  const handleSendReminder = async () => {
    if (!currentRecord || !currentRecord.customer) return;

    try {
      setLoading(true);

      // In a real app, this would connect to an email service
      // For now, we'll just update the last_reminder_date

      const { error } = await supabase
        .from('credit_records')
        .update({
          last_reminder_date: new Date().toISOString()
        })
        .eq('id', currentRecord.id);

      if (error) throw error;

      const updatedRecords = creditRecords.map(record =>
        record.id === currentRecord.id 
          ? { ...record, last_reminder_date: new Date().toISOString() }
          : record
      );
      
      setCreditRecords(updatedRecords);
      setFilteredRecords(updatedRecords);
      setIsSendReminderOpen(false);
      toast.success(`Reminder sent to ${currentRecord.customer.name}`);
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">Paid</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300">Partial</Badge>;
      case 'unpaid':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date();
    const due = parseISO(dueDate);
    
    if (isBefore(due, today)) {
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300">Overdue</Badge>;
    } else if (isBefore(due, addDays(today, 3))) {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300">Due soon</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300">Upcoming</Badge>;
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPaymentReceiptFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-purple-900">Credit Management</h1>
          <p className="text-muted-foreground">
            Track and manage customer credit and payments
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> New Credit Record
          </Button>
        </div>
      </div>

      <Card className="border-purple-200 shadow-lg hover:shadow-purple-100 transition-all">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-50 pb-4">
          <CardTitle className="text-purple-900">Credit Records</CardTitle>
          <CardDescription>
            Manage credit records and payment information
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] focus:ring-purple-500 focus:border-purple-500">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-purple-50">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Initial Amount</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No credit records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow 
                        key={record.id} 
                        className="hover:bg-purple-50"
                      >
                        <TableCell className="font-medium">
                          {record.customer?.name || "Unknown Customer"}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(record.initial_amount)}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(record.remaining_amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {format(parseISO(record.due_date), "dd MMM yyyy")}
                            <div className="mt-1">
                              {getDueDateStatus(record.due_date)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(record.created_at), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => loadPayments(record)}
                              className="hover:bg-purple-100 hover:text-purple-800"
                              title="View payment history"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            {record.status !== 'paid' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentRecord(record);
                                  setIsPaymentDialogOpen(true);
                                  setNewPayment({
                                    ...newPayment,
                                    amount: record.remaining_amount
                                  });
                                }}
                                className="hover:bg-green-100 hover:text-green-800"
                                title="Add payment"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentRecord(record);
                                setIsEditDialogOpen(true);
                              }}
                              className="hover:bg-purple-100 hover:text-purple-800"
                              title="Edit record"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {record.status !== 'paid' && record.customer?.email && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setCurrentRecord(record);
                                  setIsSendReminderOpen(true);
                                }}
                                className="hover:bg-blue-100 hover:text-blue-800"
                                title="Send reminder"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setCurrentRecord(record);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="hover:bg-red-100 hover:text-red-800"
                              title="Delete record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Credit Record Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Add Credit Record</DialogTitle>
            <DialogDescription>
              Create a new credit record for a customer
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Customer</Label>
              <Select 
                value={newRecord.customerId} 
                onValueChange={(value) => 
                  setNewRecord({...newRecord, customerId: value})
                }
              >
                <SelectTrigger id="customer" className="focus:ring-purple-500 focus:border-purple-500">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Initial Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Amount"
                  className="pl-9 focus:ring-purple-500 focus:border-purple-500"
                  value={newRecord.initialAmount}
                  onChange={(e) => 
                    setNewRecord({
                      ...newRecord, 
                      initialAmount: parseFloat(e.target.value) || 0
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <div className="flex gap-2">
                <Input
                  id="due-date"
                  type="date"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  value={newRecord.dueDate}
                  onChange={(e) => 
                    setNewRecord({...newRecord, dueDate: e.target.value})
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information"
                value={newRecord.notes}
                onChange={(e) => 
                  setNewRecord({...newRecord, notes: e.target.value})
                }
                className="focus:ring-purple-500 focus:border-purple-500"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddRecord} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Add Credit Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Credit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Edit Credit Record</DialogTitle>
            <DialogDescription>
              Update credit record details
            </DialogDescription>
          </DialogHeader>
          {currentRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Customer</Label>
                <Input 
                  value={currentRecord.customer?.name || "Unknown Customer"} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label>Initial Amount</Label>
                  <span className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.initial_amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <Label>Remaining Amount</Label>
                  <span className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.remaining_amount)}
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due-date">Due Date</Label>
                <div className="flex gap-2">
                  <Input
                    id="due-date"
                    type="date"
                    value={format(parseISO(currentRecord.due_date), "yyyy-MM-dd")}
                    onChange={(e) => 
                      setCurrentRecord({
                        ...currentRecord, 
                        due_date: e.target.value
                      })
                    }
                    className="focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional information"
                  value={currentRecord.notes || ""}
                  onChange={(e) => 
                    setCurrentRecord({
                      ...currentRecord,
                      notes: e.target.value
                    })
                  }
                  className="focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateRecord}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Update Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for this credit record
            </DialogDescription>
          </DialogHeader>
          {currentRecord && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Customer</Label>
                <Input 
                  value={currentRecord.customer?.name || "Unknown Customer"} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <Label>Remaining Balance</Label>
                  <span className="text-sm text-muted-foreground font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.remaining_amount)}
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-amount">Payment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">Rp</span>
                  <Input
                    id="payment-amount"
                    type="number"
                    placeholder="Amount"
                    className="pl-9 focus:ring-purple-500 focus:border-purple-500"
                    value={newPayment.amount}
                    onChange={(e) => 
                      setNewPayment({
                        ...newPayment, 
                        amount: parseFloat(e.target.value) || 0
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select 
                  value={newPayment.payment_method || "cash"} 
                  onValueChange={(value) => 
                    setNewPayment({...newPayment, payment_method: value})
                  }
                >
                  <SelectTrigger id="payment-method" className="focus:ring-purple-500 focus:border-purple-500">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-date">Payment Date</Label>
                <Input
                  id="payment-date"
                  type="date"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  value={newPayment.payment_date}
                  onChange={(e) => 
                    setNewPayment({...newPayment, payment_date: e.target.value})
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-receipt">Receipt (Optional)</Label>
                <Input 
                  id="payment-receipt" 
                  type="file"
                  className="focus:ring-purple-500 focus:border-purple-500"
                  onChange={handleReceiptFileChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload payment receipt or proof if available
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment-notes">Notes</Label>
                <Textarea
                  id="payment-notes"
                  placeholder="Additional payment information"
                  value={newPayment.notes || ""}
                  onChange={(e) => 
                    setNewPayment({...newPayment, notes: e.target.value})
                  }
                  className="focus:ring-purple-500 focus:border-purple-500"
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddPayment}
              disabled={loading || !newPayment.amount || newPayment.amount <= 0}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Record Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Credit Record Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Credit Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this credit record?
            </DialogDescription>
          </DialogHeader>
          {currentRecord && (
            <div className="space-y-4">
              <p>
                This will permanently delete the credit record for{" "}
                <span className="font-semibold">{currentRecord.customer?.name || "Unknown Customer"}</span>.
              </p>
              <div className="border rounded-md p-4 bg-gray-50 space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Initial Amount:</span>
                  <span className="text-sm font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.initial_amount)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Remaining Amount:</span>
                  <span className="text-sm font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.remaining_amount)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span className="text-sm">
                    {format(parseISO(currentRecord.due_date), "dd MMM yyyy")}
                  </span>
                </div>
              </div>
              <p className="text-red-600">
                This action cannot be undone. All payment records for this credit will also be deleted.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRecord}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Payments Dialog */}
      <Dialog open={isViewPaymentsOpen} onOpenChange={setIsViewPaymentsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Payment History</DialogTitle>
            <DialogDescription>
              {currentRecord?.customer?.name || "Customer"} - Payment Records
            </DialogDescription>
          </DialogHeader>
          {currentRecord && (
            <div className="space-y-4 py-2">
              <div className="border rounded-md bg-gray-50 p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Initial Amount</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.initial_amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Remaining Balance</p>
                  <p className="font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.remaining_amount)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p>
                    {format(parseISO(currentRecord.due_date), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>
                    {getStatusBadge(currentRecord.status)}
                  </p>
                </div>
              </div>
              
              <Table className="border">
                <TableHeader className="bg-purple-50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No payment records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPayments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-purple-50">
                        <TableCell>
                          {format(parseISO(payment.payment_date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(payment.amount)}
                        </TableCell>
                        <TableCell className="capitalize">
                          {payment.payment_method?.replace('_', ' ') || "Cash"}
                        </TableCell>
                        <TableCell>
                          {payment.receipt_url ? (
                            <a 
                              href={payment.receipt_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View Receipt
                            </a>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {payment.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {currentRecord.status !== 'paid' && (
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      setIsViewPaymentsOpen(false);
                      setIsPaymentDialogOpen(true);
                      setNewPayment({
                        ...newPayment,
                        amount: currentRecord.remaining_amount
                      });
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add New Payment
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPaymentsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={isSendReminderOpen} onOpenChange={setIsSendReminderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-purple-900">Send Payment Reminder</DialogTitle>
            <DialogDescription>
              Send a payment reminder to the customer
            </DialogDescription>
          </DialogHeader>
          {currentRecord && currentRecord.customer && (
            <div className="space-y-4 py-2">
              <div className="border rounded-md p-4 space-y-2">
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Customer:</span>
                  <span className="text-sm font-semibold">{currentRecord.customer.name}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">{currentRecord.customer.email || "N/A"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm">{currentRecord.customer.phone || "N/A"}</span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Remaining Amount:</span>
                  <span className="text-sm font-semibold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(currentRecord.remaining_amount)}
                  </span>
                </div>
                <div className="grid grid-cols-2">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span className="text-sm">
                    {format(parseISO(currentRecord.due_date), "dd MMM yyyy")}
                  </span>
                </div>
                {currentRecord.last_reminder_date && (
                  <div className="grid grid-cols-2">
                    <span className="text-sm text-muted-foreground">Last Reminder:</span>
                    <span className="text-sm">
                      {format(parseISO(currentRecord.last_reminder_date), "dd MMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Reminder Template</Label>
                <div className="border rounded-md p-4 bg-gray-50 text-sm">
                  <p className="mb-2">Dear {currentRecord.customer.name},</p>
                  <p className="mb-2">
                    This is a friendly reminder that you have an outstanding balance of{" "}
                    <strong>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(currentRecord.remaining_amount)}
                    </strong>{" "}
                    due on{" "}
                    <strong>
                      {format(parseISO(currentRecord.due_date), "dd MMMM yyyy")}
                    </strong>.
                  </p>
                  <p className="mb-2">
                    Please arrange for payment at your earliest convenience. If you have any
                    questions or concerns, please don't hesitate to contact us.
                  </p>
                  <p>Thank you for your prompt attention to this matter.</p>
                  <p className="mt-4">Best regards,<br />RetailAyu Team</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendReminderOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendReminder}
              disabled={loading || !currentRecord?.customer?.email}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : "Send Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
